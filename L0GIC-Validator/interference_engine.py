#!/usr/bin/env python3
"""
interference_engine.py

Upgraded interference detection service with:
- Weighted emotion inputs
- Sensory-aware suppression/amplification detection
- Rule language enhancements: regex input matching and contextual preconditions
- Auto-mitigation suggestions (from emotion_profiles actions and sensory counteractions)
- FastAPI HTTP API for programmatic queries
- CLI demo as well

Endpoints:
- POST /detect
  body: { "emotions": ["Love","Anger"] | [["Love",0.9],["Anger",0.4]], "rules_path": optional, "sensory_threshold": optional }
  returns detailed interference analysis

- POST /mitigate
  body: { "emotions": ..., "apply": false|true }
  returns suggested mitigations; if apply=true will return "applied" field (no side effects by default
  unless you supply a callback or integration hook)

- GET /rules
  returns currently-loaded rules

Rule language:
- Each rule keyed by emotion name may include:
  - blocks: [ "OtherEmotion", ... ]                      # exact emotion names
  - blocks_regex: [ "Hope.*", ... ]                      # regexes to match emotion names
  - suppress / amplify: lists of sensory keys (taste/scent/touch) OR regexes
  - preconditions: list of callables described as simple declarative checks, currently supported:
      * {"type":"presence","emotion":"Anger"}            # require 'Anger' present
      * {"type":"min_weight","emotion":"Anger","threshold":0.5}
    (preconditions must all be satisfied for the rule to apply)
  - reason: textual rationale
- Rules may be loaded from a JSON file (path provided to API or set via env)

Mitigations:
- Emotion-level: suggest actions from EMOTION_PROFILES[emotion]["actions"], if present
- Sensory-level: suggest counteractions (mapping in SENSORY_COUNTERACTIONS) — e.g. if "Spicy" amplified suggest "cooling" actions
- Mitigations are suggestions only; apply pathway is pluggable (no automatic side-effects by default)

Notes:
- This module expects sensory_engine functions and (optionally) emotion_profiles module to be present.
- FastAPI is optional; if not installed the app won't start but library functions remain usable.

"""

from __future__ import annotations

import json
import logging
import re
from collections import defaultdict
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple, Union

# Sensory & emotion helpers (must exist in your project)
from sensory_engine import (
    normalize_emotions,
    get_taste_profile,
    get_scent_profile,
    get_touch_profile,
    top_n_keys,
)
try:
    from emotion_profiles import EMOTION_PROFILES  # optional but recommended
except Exception:
    EMOTION_PROFILES = {}

# Optional FastAPI
try:
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    FASTAPI_AVAILABLE = True
except Exception:
    FASTAPI_AVAILABLE = False

logger = logging.getLogger("interference_engine")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

EmotionInput = Union[str, Tuple[str, float]]
WeightedEmotions = Dict[str, float]


# Default rule set (can be extended/overridden by loading from file)
DEFAULT_INTERFERENCE_MAP: Dict[str, Dict[str, Any]] = {
    "Shame": {
        "blocks": ["Hope", "Faith"],
        "blocks_regex": [],
        "suppress": ["Sweet", "Floral", "Warm"],
        "suppress_regex": [],
        "amplify": [],
        "amplify_regex": [],
        "preconditions": [],
        "reason": "Shame suppresses serotonin and oxytocin, reducing optimism and sensory bonding."
    },
    "Anger": {
        "blocks": ["Peace", "Forgiveness"],
        "blocks_regex": [],
        "suppress": [],
        "suppress_regex": [],
        "amplify": ["Spicy", "Sharp", "Sour"],
        "amplify_regex": [],
        "preconditions": [],
        "reason": "Anger spikes cortisol and adrenaline, intensifying rupture and sensory volatility."
    },
    "Love": {
        "blocks": [],
        "blocks_regex": [],
        "suppress": [],
        "suppress_regex": [],
        "amplify": ["Sweet", "Floral", "Soft"],
        "amplify_regex": [],
        "preconditions": [],
        "reason": "Love boosts oxytocin and dopamine, enhancing bonding and sensory comfort."
    },
    "Longing": {
        "blocks": [],
        "blocks_regex": [],
        "suppress": [],
        "suppress_regex": [],
        "amplify": ["Bitter", "Rot", "Cold"],
        "amplify_regex": [],
        "preconditions": [],
        "reason": "Longing sustains dopamine-cortisol loops, deepening symbolic hunger and decay."
    },
    "Peace": {
        "blocks": ["Anger"],
        "blocks_regex": [],
        "suppress": [],
        "suppress_regex": [],
        "amplify": ["Umami", "Earthy", "Still"],
        "amplify_regex": [],
        "preconditions": [],
        "reason": "Peace stabilizes GABA and serotonin, promoting grounding and sensory calm."
    }
}

# Sensory -> recommended counteraction mapping (simple)
SENSORY_COUNTERACTIONS: Dict[str, List[str]] = {
    "Spicy": ["apply_cooling", "offer_water", "play_calm_tone"],
    "Sharp": ["soften_touch", "apply_padding"],
    "Sour": ["offer_sweet", "neutralize_acid"],
    "Rot": ["sanitize", "remove_source", "air_out"],
    "Bitter": ["offer_sweet", "comfort"],
    "Sweet": ["sustain", "celebrate"],
    "Floral": ["present_flowers", "brighten"],
    "Soft": ["hug", "gentle_touch"],
    "Warm": ["warm_beverage", "blanket"],
    "Umami": ["grounding_breath", "rooting_music"],
    "Earthy": ["grounding_walk"],
    "Still": ["silence_mode"],
    "Cold": ["warm_contact"],
}

# Utility: compile regex lists for performance
def _compile_patterns(patterns: Sequence[str]) -> List[re.Pattern]:
    out = []
    for p in patterns:
        try:
            out.append(re.compile(p))
        except re.error:
            logger.warning("Invalid regex pattern in rules: %s", p)
    return out


def _normalize_rules(raw: Dict[str, Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Normalize and validate rules. Ensures all expected keys exist and compiles regexes.
    """
    normalized: Dict[str, Dict[str, Any]] = {}
    for key, entry in raw.items():
        if not isinstance(entry, dict):
            continue
        e = {
            "blocks": list(entry.get("blocks", []) or []),
            "blocks_regex": _compile_patterns(list(entry.get("blocks_regex", []) or [])),
            "suppress": list(entry.get("suppress", []) or []),
            "suppress_regex": _compile_patterns(list(entry.get("suppress_regex", []) or [])),
            "amplify": list(entry.get("amplify", []) or []),
            "amplify_regex": _compile_patterns(list(entry.get("amplify_regex", []) or [])),
            "preconditions": list(entry.get("preconditions", []) or []),
            "reason": str(entry.get("reason", "") or "")
        }
        normalized[str(key)] = e
    return normalized


# Default loaded rules
_LOADED_RULES = _normalize_rules(DEFAULT_INTERFERENCE_MAP)


# Helper: evaluate simple declarative preconditions
def _evaluate_preconditions(preconditions: Sequence[Dict[str, Any]], weighted_emotions: WeightedEmotions) -> bool:
    """
    Supported precondition types:
      - {"type":"presence", "emotion":"Anger"} -> requires that emotion present (weight>0)
      - {"type":"min_weight", "emotion":"Anger", "threshold":0.5} -> requires weight >= threshold
    """
    for cond in preconditions:
        ctype = cond.get("type")
        if ctype == "presence":
            emo = cond.get("emotion")
            if not emo or weighted_emotions.get(emo, 0.0) <= 0.0:
                return False
        elif ctype == "min_weight":
            emo = cond.get("emotion")
            thr = float(cond.get("threshold", 0.0))
            if weighted_emotions.get(emo, 0.0) < thr:
                return False
        else:
            # unknown precondition type: treat as not satisfied to be conservative
            logger.debug("Unknown precondition type: %s", ctype)
            return False
    return True


def _sense_matches_case_insensitive(target: str, profile_map: Dict[str, float], threshold: float = 0.0) -> Tuple[bool, float]:
    t = target.lower()
    best_score = 0.0
    for k, v in profile_map.items():
        if k.lower() == t and v > threshold:
            best_score = max(best_score, float(v))
    return (best_score > 0.0, best_score)


def _sense_matches_regex(patterns: List[re.Pattern], profile_map: Dict[str, float], threshold: float = 0.0) -> List[Tuple[str, float]]:
    matches: List[Tuple[str, float]] = []
    for pat in patterns:
        for k, v in profile_map.items():
            if pat.search(k) and v > threshold:
                matches.append((k, float(v)))
    return matches


# Core detection algorithm (exposed as library function)
def detect_interference(
    emotions: Iterable[EmotionInput],
    rules: Optional[Dict[str, Dict[str, Any]]] = None,
    sensory_threshold: float = 0.01,
    include_profiles: bool = True,
) -> Dict[str, Any]:
    """
    Returns structured result:
      {
        "clashes": [...],
        "amplifications": [...],
        "summary": {...},
        "profiles": {taste:..., scent:..., touch:...},
        "mitigations": {... suggested mitigations ...}
      }
    """
    rules = _normalize_rules(rules) if rules is not None else _LOADED_RULES
    weighted = normalize_emotions(emotions)
    active = set(weighted.keys())

    # compute profiles (sensory_engine expects iterable of (emotion,weight) or list; we pass items())
    taste = get_taste_profile(weighted.items())
    scent = get_scent_profile(weighted.items())
    touch = get_touch_profile(weighted.items())

    clashes = []
    amplifications = []
    mitigations = []  # suggestions aggregated

    # iterate over rules for emotions that may act as sources
    for src_rule_key, rule in rules.items():
        # source rule may be keyed by emotion name; check if rule applies (src present or regex matches)
        applicable_sources = []
        # exact name match (case-sensitive keyed name)
        if src_rule_key in weighted:
            applicable_sources.append(src_rule_key)
        # also accept case-insensitive match
        for k in list(weighted.keys()):
            if k.lower() == src_rule_key.lower() and k not in applicable_sources:
                applicable_sources.append(k)
        # also allow regex matching of keys if src_rule_key looks like a regex (we permit)
        try:
            src_pat = re.compile(src_rule_key)
            for k in weighted.keys():
                if src_pat.search(k) and k not in applicable_sources:
                    applicable_sources.append(k)
        except re.error:
            pass

        if not applicable_sources:
            continue

        for src in applicable_sources:
            # precondition check
            if not _evaluate_preconditions(rule.get("preconditions", []), weighted):
                logger.debug("Preconditions not met for rule %s (source %s)", src_rule_key, src)
                continue

            # Emotion-level blocks
            for blocked in rule.get("blocks", []) or []:
                if blocked in active:
                    severity = round(min(1.0, weighted.get(src, 1.0) * weighted.get(blocked, 1.0)), 4)
                    clashes.append({
                        "source": src,
                        "target": blocked,
                        "type": "emotional_block",
                        "severity": severity,
                        "reason": rule.get("reason", ""),
                        "details": {"source_weight": weighted.get(src, 0.0), "target_weight": weighted.get(blocked, 0.0)}
                    })
                    # suggested mitigations: suggest actions for blocked & source
                    mitigations.append({
                        "source": src, "target": blocked,
                        "suggested": _suggest_emotion_mitigations(blocked) + _suggest_emotion_mitigations(src),
                        "reason": "emotion_block"
                    })

            # Emotion-level regex blocks
            for pat in rule.get("blocks_regex", []) or []:
                try:
                    cre = re.compile(pat)
                except re.error:
                    continue
                for other in active:
                    if cre.search(other):
                        severity = round(min(1.0, weighted.get(src, 1.0) * weighted.get(other, 1.0)), 4)
                        clashes.append({
                            "source": src,
                            "target": other,
                            "type": "emotional_block_regex",
                            "severity": severity,
                            "reason": rule.get("reason", ""),
                            "details": {"regex": pat}
                        })
                        mitigations.append({
                            "source": src, "target": other,
                            "suggested": _suggest_emotion_mitigations(other) + _suggest_emotion_mitigations(src),
                            "reason": "emotion_block_regex"
                        })

            # Sensory suppression (explicit keys)
            for suppressed in rule.get("suppress", []) or []:
                present, score = _sense_matches_case_insensitive(suppressed, taste, sensory_threshold)
                p2, s2 = _sense_matches_case_insensitive(suppressed, scent, sensory_threshold)
                p3, s3 = _sense_matches_case_insensitive(suppressed, touch, sensory_threshold)
                total_score = max(score, s2, s3)
                if total_score > sensory_threshold:
                    severity = round(min(1.0, weighted.get(src, 1.0) * total_score), 4)
                    clashes.append({
                        "source": src,
                        "target": suppressed,
                        "type": "sensory_suppression",
                        "severity": severity,
                        "reason": rule.get("reason", ""),
                        "details": {"sense_score": total_score}
                    })
                    mitigations.append({
                        "source": src,
                        "target": suppressed,
                        "suggested": _suggest_sensory_counteractions(suppressed),
                        "reason": "sensory_suppression"
                    })

            # Sensory suppression regex
            for pat in rule.get("suppress_regex", []) or []:
                cre = pat
                found = _sense_matches_regex([cre], taste, sensory_threshold) + _sense_matches_regex([cre], scent, sensory_threshold) + _sense_matches_regex([cre], touch, sensory_threshold)
                for k, score in found:
                    severity = round(min(1.0, weighted.get(src, 1.0) * score), 4)
                    clashes.append({
                        "source": src,
                        "target": k,
                        "type": "sensory_suppression_regex",
                        "severity": severity,
                        "reason": rule.get("reason", ""),
                        "details": {"pattern": cre.pattern, "sense_score": score}
                    })
                    mitigations.append({
                        "source": src,
                        "target": k,
                        "suggested": _suggest_sensory_counteractions(k),
                        "reason": "sensory_suppression_regex"
                    })

            # Sensory amplification (explicit)
            for amplified in rule.get("amplify", []) or []:
                present, score = _sense_matches_case_insensitive(amplified, taste, sensory_threshold)
                p2, s2 = _sense_matches_case_insensitive(amplified, scent, sensory_threshold)
                p3, s3 = _sense_matches_case_insensitive(amplified, touch, sensory_threshold)
                total_score = max(score, s2, s3)
                # amplification may be relevant even with small sense score; scale with source weight
                if total_score > 0.0 or weighted.get(src, 0.0) > 0.0:
                    severity = round(min(1.0, weighted.get(src, 1.0) * max(total_score, 0.1)), 4)
                    amplifications.append({
                        "source": src,
                        "target": amplified,
                        "type": "sensory_amplification",
                        "severity": severity,
                        "reason": rule.get("reason", ""),
                        "details": {"sense_score": total_score}
                    })
                    mitigations.append({
                        "source": src,
                        "target": amplified,
                        "suggested": _suggest_sensory_counteractions(amplified),
                        "reason": "sensory_amplification"
                    })

            # Sensory amplification regex
            for pat in rule.get("amplify_regex", []) or []:
                cre = pat
                found = _sense_matches_regex([cre], taste, sensory_threshold) + _sense_matches_regex([cre], scent, sensory_threshold) + _sense_matches_regex([cre], touch, sensory_threshold)
                for k, score in found:
                    severity = round(min(1.0, weighted.get(src, 1.0) * max(score, 0.1)), 4)
                    amplifications.append({
                        "source": src,
                        "target": k,
                        "type": "sensory_amplification_regex",
                        "severity": severity,
                        "reason": rule.get("reason", ""),
                        "details": {"pattern": cre.pattern, "sense_score": score}
                    })
                    mitigations.append({
                        "source": src,
                        "target": k,
                        "suggested": _suggest_sensory_counteractions(k),
                        "reason": "sensory_amplification_regex"
                    })

    # Consolidate duplicates (keep max severity) and sort
    def _consolidate(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        m = {}
        for it in items:
            key = (it["source"], it["target"], it["type"])
            if key not in m:
                m[key] = dict(it)
            else:
                m[key]["severity"] = max(m[key].get("severity", 0.0), it.get("severity", 0.0))
        out = list(m.values())
        out.sort(key=lambda x: (-x.get("severity", 0.0), x.get("source", ""), x.get("target", "")))
        return out

    consolidated_clashes = _consolidate(clashes)
    consolidated_amps = _consolidate(amplifications)

    # Consolidate mitigation suggestions (group by target)
    mitigation_map: Dict[Tuple[str, str], Dict[str, Any]] = {}
    for mg in mitigations:
        key = (mg["source"], mg["target"])
        if key not in mitigation_map:
            mitigation_map[key] = {"source": mg["source"], "target": mg["target"], "suggested": list(mg.get("suggested", []))}
        else:
            mitigation_map[key]["suggested"].extend(mg.get("suggested", []))
    # dedupe suggested actions
    for v in mitigation_map.values():
        v["suggested"] = list(dict.fromkeys(v["suggested"]))

    summary = {
        "num_clashes": len(consolidated_clashes),
        "num_amplifications": len(consolidated_amps),
        "active_emotions": weighted,
    }

    return {
        "clashes": consolidated_clashes,
        "amplifications": consolidated_amps,
        "mitigation_suggestions": list(mitigation_map.values()),
        "summary": summary,
        "profiles": {"taste": taste, "scent": scent, "touch": touch}
    }


# -------------------------
# Mitigation helpers
# -------------------------
def _suggest_emotion_mitigations(emotion_name: str) -> List[str]:
    """
    Suggest actions for an emotion using EMOTION_PROFILES (if available).
    """
    if not EMOTION_PROFILES:
        return []
    profile = EMOTION_PROFILES.get(emotion_name) or EMOTION_PROFILES.get(emotion_name.capitalize())
    if not profile:
        return []
    acts = profile.get("actions") or []
    # Prefer short unique actions
    return [str(a) for a in acts]


def _suggest_sensory_counteractions(sense_key: str) -> List[str]:
    # direct match
    if sense_key in SENSORY_COUNTERACTIONS:
        return list(SENSORY_COUNTERACTIONS[sense_key])
    # case-insensitive
    for k, v in SENSORY_COUNTERACTIONS.items():
        if k.lower() == sense_key.lower():
            return list(v)
    # regex fallback: find any whose key matches substring
    res = []
    for k, v in SENSORY_COUNTERACTIONS.items():
        if sense_key.lower() in k.lower():
            res.extend(v)
    return list(dict.fromkeys(res))


# -------------------------
# FastAPI wrapper (if available)
# -------------------------
if FASTAPI_AVAILABLE:
    app = FastAPI(title="Interference Engine", version="1.2")

    class DetectRequest(BaseModel):
        emotions: List[Union[str, List[Union[str, float]]]]  # flexible typing for pydantic
        rules_path: Optional[str] = None
        sensory_threshold: Optional[float] = 0.01

    class MitigateRequest(DetectRequest):
        apply: Optional[bool] = False

    @app.post("/detect")
    def api_detect(req: DetectRequest):
        # normalize incoming emotions to (name,weight)
        raw = req.emotions or []
        normalized = []
        for e in raw:
            if isinstance(e, list) and len(e) >= 2:
                normalized.append((str(e[0]), float(e[1])))
            else:
                normalized.append(str(e))
        rules = None
        if req.rules_path:
            try:
                with open(req.rules_path, "r", encoding="utf-8") as fh:
                    rules = json.load(fh)
            except Exception as ex:
                raise HTTPException(status_code=400, detail=f"Failed to load rules: {ex}")
        res = detect_interference(normalized, rules=rules, sensory_threshold=req.sensory_threshold or 0.01)
        return res

    @app.post("/mitigate")
    def api_mitigate(req: MitigateRequest):
        # same normalization
        raw = req.emotions or []
        normalized = []
        for e in raw:
            if isinstance(e, list) and len(e) >= 2:
                normalized.append((str(e[0]), float(e[1])))
            else:
                normalized.append(str(e))
        rules = None
        if req.rules_path:
            try:
                with open(req.rules_path, "r", encoding="utf-8") as fh:
                    rules = json.load(fh)
            except Exception as ex:
                raise HTTPException(status_code=400, detail=f"Failed to load rules: {ex}")
        analysis = detect_interference(normalized, rules=rules, sensory_threshold=req.sensory_threshold or 0.01)
        suggestions = analysis.get("mitigation_suggestions", [])

        # If apply==True, we do not execute external side-effects here; we instead return "applied" field
        applied = []
        if req.apply:
            # naive local application: we mark suggestions as 'applied' in response.
            # Real integration should call appropriate orchestration (notify, send command, etc.)
            for s in suggestions:
                applied.append({"source": s["source"], "target": s["target"], "applied_actions": s.get("suggested", [])})

        return {"analysis": analysis, "suggestions": suggestions, "applied": applied}

    @app.get("/rules")
    def api_get_rules():
        # return the normalized loaded rules
        return _LOADED_RULES

    # FastAPI startup message
    logger.info("Interference engine FastAPI app available (FASTAPI_AVAILABLE=True)")

else:
    app = None
    logger.info("FastAPI not installed; API endpoints disabled. Use detect_interference() directly.")


def detect_interference(emotions):
    # Emotional blocks, sensory suppression, and amplification
    ...
    return {
        "clashes": [...],
        "amplifications": [...]
    }

# -------------------------
# CLI demo
# -------------------------
def _demo():
    sample = [("Love", 1.0), ("Anger", 0.8), ("Shame", 0.6)]
    print("Input sample:", sample)
    res = detect_interference(sample)
    print("\nSummary:")
    print(json.dumps(res["summary"], indent=2, ensure_ascii=False))
    print("\nClashes:")
    for c in res["clashes"]:
        print(f" - {c['source']} blocks {c['target']} (severity={c['severity']}) reason: {c.get('reason')}")
    print("\nAmplifications:")
    for a in res["amplifications"]:
        print(f" - {a['source']} -> {a['target']} (severity={a['severity']}) reason: {a.get('reason')}")
    print("\nMitigation suggestions:")
    for m in res["mitigation_suggestions"]:
        print(f" - {m['source']} -> {m['target']}: actions={m['suggested']}")
    print("\nProfiles:")
    print(json.dumps(res["profiles"], indent=2, ensure_ascii=False))


if __name__ == "__main__":
    _demo()