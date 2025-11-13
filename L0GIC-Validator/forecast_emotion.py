#!/usr/bin/env python3
"""
forecast_emotion.py

Upgraded emotional forecasting utility.

Improvements applied:
- Uses the enhanced interference_engine.detect_interference() (supports weighted emotions,
  regex rules, preconditions, and mitigation suggestions).
- Accepts emotion inputs as strings or (emotion, weight) pairs.
- Produces a richer forecast payload:
    * blocked_emotions (with severities)
    * amplified_traces (with severities and suggested mitigations)
    * mitigation_plan (aggregated suggested actions)
    * sensory_profiles (taste/scent/touch)
    * next_state: scored candidate states and a human-friendly summary
- Improved predict_next_state:
    * removes blocked emotions
    * considers sensory amplification severity, active emotion weights, and profile trends
    * computes multiple candidate next states with confidence scores
- Optional parameters: top_n_candidates, apply_mitigations (no external side-effects by default)
- CLI and programmatic API.

Example usage:
    from forecast_emotion import forecast_emotional_shift
    forecast = forecast_emotional_shift([("Love",1.0), ("Anger",0.8)])
    print(forecast)
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple, Union

# Use enhanced interference engine and sensory engine
from interference_engine import detect_interference, _LOADED_RULES  # assume improved engine present
from sensory_engine import get_taste_profile, get_scent_profile, get_touch_profile, normalize_emotions, top_n_keys

# Optional: use canonical EMOTION_PROFILES for suggested actions
try:
    from emotion_profiles import EMOTION_PROFILES  # type: ignore
except Exception:
    EMOTION_PROFILES = {}

logger = logging.getLogger("forecast_emotion")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

EmotionInput = Union[str, Tuple[str, float]]
WeightedEmotions = Dict[str, float]


def _normalize_input(emotions: Iterable[EmotionInput]) -> List[Tuple[str, float]]:
    """
    Normalize input to a list of (emotion, weight). Accepts:
      - "Love" -> ("Love", 1.0)
      - ("Love", 0.8) -> ("Love", 0.8)
    """
    out: List[Tuple[str, float]] = []
    for e in emotions:
        if isinstance(e, (list, tuple)):
            try:
                name = str(e[0])
                w = float(e[1])
            except Exception:
                continue
        else:
            name = str(e)
            w = 1.0
        out.append((name, w))
    return out


def _aggregate_mitigations(mitigation_suggestions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Merge and deduplicate mitigation suggestions returned from detect_interference into a compact plan.
    Each suggestion item: {source, target, suggested: [...]}.
    Returns list of {target, suggested: [...], sources: [...]}.
    """
    plan: Dict[str, Dict[str, Any]] = {}
    for s in mitigation_suggestions:
        tgt = s.get("target")
        src = s.get("source")
        actions = s.get("suggested") or []
        if tgt not in plan:
            plan[tgt] = {"target": tgt, "suggested": [], "sources": set()}
        # extend suggested, keep order and uniqueness
        for a in actions:
            if a not in plan[tgt]["suggested"]:
                plan[tgt]["suggested"].append(a)
        if src:
            plan[tgt]["sources"].add(src)
    # convert sets to lists
    out = []
    for v in plan.values():
        out.append({"target": v["target"], "suggested": v["suggested"], "sources": sorted(list(v["sources"]))})
    return out


def forecast_emotional_shift(
    emotions: Iterable[EmotionInput],
    top_n_candidates: int = 3,
    sensory_threshold: float = 0.01,
    rules: Optional[Dict[str, Dict[str, Any]]] = None,
    apply_mitigations: bool = False,
) -> Dict[str, Any]:
    """
    Main forecasting function.

    returns a dict:
      {
        "input": [ (emotion, weight), ... ],
        "blocked_emotions": [ {target, severity, source}, ... ],
        "amplified_traces": [ {trace, severity, source}, ... ],
        "mitigation_plan": [ {target, suggested, sources}, ... ],
        "profiles": {taste:..., scent:..., touch:...},
        "next_state": { "candidates": [ {label, score, reason} ], "summary": str }
      }
    """
    normalized = _normalize_input(emotions)
    weighted_map = {k: v for k, v in normalized}

    # Run interference detection (returns consolidated results and mitigation suggestions)
    analysis = detect_interference(normalized, rules=rules, sensory_threshold=sensory_threshold)
    # analysis keys: clashes, amplifications, mitigation_suggestions, summary, profiles
    clashes = analysis.get("clashes", [])
    amplifications = analysis.get("amplifications", [])
    mitigation_suggestions = analysis.get("mitigation_suggestions", [])

    # Build structured blocked and amplified lists with severities
    blocked = []
    for c in clashes:
        if c.get("type", "").startswith("emotional"):
            blocked.append({"target": c.get("target"), "severity": c.get("severity"), "source": c.get("source"), "reason": c.get("reason", "")})

    amplified = []
    for a in amplifications:
        amplified.append({"trace": a.get("target"), "severity": a.get("severity"), "source": a.get("source"), "reason": a.get("reason", "")})

    # Aggregate mitigation suggestions into a plan
    mitigation_plan = _aggregate_mitigations(mitigation_suggestions or [])

    # Optionally mark mitigations as 'applied' (no external side-effects performed here)
    if apply_mitigations:
        for item in mitigation_plan:
            item["applied"] = True  # Application is nominal here; integration point for real actions

    profiles = analysis.get("profiles", {})
    taste = profiles.get("taste", {}) or get_taste_profile(normalized)
    scent = profiles.get("scent", {}) or get_scent_profile(normalized)
    touch = profiles.get("touch", {}) or get_touch_profile(normalized)

    # Predict next state using sensory amplification and remaining active emotions
    next_state = predict_next_state(normalized, blocked, amplified, taste, scent, touch, top_n=top_n_candidates)

    return {
        "input": normalized,
        "blocked_emotions": blocked,
        "amplified_traces": amplified,
        "mitigation_plan": mitigation_plan,
        "profiles": {"taste": taste, "scent": scent, "touch": touch},
        "next_state": next_state,
        "raw_analysis": analysis
    }


def predict_next_state(
    normalized_emotions: Sequence[Tuple[str, float]],
    blocked: Sequence[Dict[str, Any]],
    amplified: Sequence[Dict[str, Any]],
    taste_profile: Dict[str, float],
    scent_profile: Dict[str, float],
    touch_profile: Dict[str, float],
    top_n: int = 3
) -> Dict[str, Any]:
    """
    Predict a ranked list of candidate next symbolic states.

    Strategy:
      - Remove blocked emotions from active set.
      - Compute an emotion-score baseline from remaining weighted_emotions.
      - For each amplified sensory trace compute a score combining:
          * amplification severity
          * sensory_profile score for that trace (sum across senses)
          * aggregate emotion baseline weight
      - Candidate labels: top amplified traces (symbolic), plus dominant remaining emotions.
      - Normalize scores into 0..1 confidence.
    """
    # Build maps
    blocked_set = {b["target"] for b in blocked}
    active = [(e, w) for (e, w) in normalized_emotions if e not in blocked_set and w > 0.0]
    active_map = {e: w for e, w in active}
    total_active_weight = sum(active_map.values()) or 1.0

    # Aggregate sensory weight by trace name from provided profiles
    sensory_scores: Dict[str, float] = {}
    def add_to_sensory(k: str, v: float):
        sensory_scores[k] = sensory_scores.get(k, 0.0) + float(v)

    for k, v in taste_profile.items():
        add_to_sensory(k, v)
    for k, v in scent_profile.items():
        add_to_sensory(k, v)
    for k, v in touch_profile.items():
        add_to_sensory(k, v)

    # Score amplified traces
    trace_scores: Dict[str, float] = {}
    for amp in amplified:
        trace = amp.get("trace")
        severity = float(amp.get("severity", 0.0))
        # sensory magnitude (could be zero if amplification but low current score)
        sens_mag = sensory_scores.get(trace, 0.0)
        # emotion baseline multiplier (how strong are active emotions)
        emotion_factor = total_active_weight / (1.0 + total_active_weight)
        score = severity * (0.7 * sens_mag + 0.3 * emotion_factor)
        trace_scores[trace] = max(trace_scores.get(trace, 0.0), score)

    # Candidate set: top traces + top active emotions (as symbolic descriptors)
    candidates: Dict[str, float] = {}
    # add traces
    for t, s in trace_scores.items():
        candidates[f"trace:{t}"] = s
    # add dominant emotions as fallback candidates (weight normalized)
    for e, w in active:
        candidates[f"emotion:{e}"] = (w / total_active_weight) * 0.5  # scale down emotion-as-state to prefer traces

    if not candidates:
        # If nothing scored, fallback to stable active emotion or a default void
        if active:
            e0 = active[0][0]
            return {"candidates": [{"label": f"stabilize:{e0}", "score": 1.0, "reason": "sole_active_emotion"}], "summary": f"Stabilizing around {e0}"}
        return {"candidates": [], "summary": "Symbolic void detected"}

    # produce ranked candidates
    ranked = sorted(candidates.items(), key=lambda kv: -kv[1])[:top_n]
    # normalize scores to 0..1
    max_score = ranked[0][1] if ranked else 1.0
    normalized_candidates = []
    for label, raw_score in ranked:
        conf = round((raw_score / max_score) if max_score > 0 else 0.0, 4)
        reason = "amplified_trace" if label.startswith("trace:") else "dominant_emotion"
        normalized_candidates.append({"label": label, "score": conf, "raw_score": round(raw_score, 6), "reason": reason})

    # human summary
    top_label = normalized_candidates[0]["label"]
    if top_label.startswith("trace:"):
        summary = f"Symbolic shift toward sensory trace '{top_label.split(':',1)[1]}' (confidence={normalized_candidates[0]['score']})"
    else:
        summary = f"Stabilizing around emotion '{top_label.split(':',1)[1]}' (confidence={normalized_candidates[0]['score']})"

    return {"candidates": normalized_candidates, "summary": summary}


# -------------------------
# CLI demo
# -------------------------
def _demo():
    examples = [
        [("Love", 1.0), ("Anger", 0.8), ("Shame", 0.5)],
        ["Love", "Hope", ("Faith", 0.7)],
        ["Anger", "Envy", "Shame"]
    ]
    for ex in examples:
        print("INPUT:", ex)
        f = forecast_emotional_shift(ex, top_n_candidates=3)
        print(json.dumps(f, indent=2, ensure_ascii=False))
        print("-" * 60)


if __name__ == "__main__":
    _demo()