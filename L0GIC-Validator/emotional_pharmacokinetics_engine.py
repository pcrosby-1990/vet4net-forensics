#!/usr/bin/env python3
"""
emotion_profiles.py

Upgraded emotion profiles data structure and helpers.

What I changed and why (summary):
- Replaced the simple dict with a richer "profile" model including:
  - canonical keys (title-cased), aliases, neurochemicals, half_life_seconds, decay_model,
    default action pipeline (list of actions to trigger when emotion fires) and interference list.
- Applied the timings & decay models from the provided table and adjusted a few half-lives
  to be expressed in seconds for consistent calculations (table values interpreted as seconds).
- Added utility functions:
  - validate_profiles(profiles): sanity-check required fields and ranges.
  - compute_decay_weight(profile, age_seconds): compute remaining influence (0..1) using decay model.
  - apply_interference(base_weight, profile, active_other_profiles): reduces weight if interfering emotions present.
  - recommend_actions(profile): returns the configured action pipeline for the emotion.
- Added small CLI/demo to print profiles, validate and run sample weight computations.
- Designed for easy extension: you can add aliases, adjust half_life_seconds, add new decay models.

Notes:
- Decay model semantics:
    * slow_fade: linear-like slow decline (1 - age/half_life) clipped
    * regenerative: decays slowly but with mild regeneration term (simple heuristic)
    * persistent: very slow decay (long tail)
    * release_burst: short lived spike with rapid falloff
    * ambient: very long half-life (background)
    * recursive: slow but can re-trigger (represented by long half-life + recursion hint)
    * volatile: faster decay, unstable
    * freeze: immediate large drop then long tail
    * explosive: fast initial spike with exponential decay
    * stabilizing: moderate decay with stabilization tendency
- Interference: list of emotion names that reduce influence (symmetric by default).
"""

from __future__ import annotations

import math
import json
from typing import Dict, List, Any, Optional

# Core emotion profiles (canonicalized keys)
# half_life_seconds uses the table numbers (interpreted as seconds)
emotion_profiles: Dict[str, Dict[str, Any]] = {
    "Love": {
        "aliases": ["love", "affection", "bond"],
        "neurochemicals": ["oxytocin", "dopamine", "vasopressin"],
        "half_life_seconds": 20,           # from table: 20 (seconds)
        "decay_model": "slow_fade",
        "actions": ["bond", "stabilize_core"],
        "interference": ["Fear", "Shame"],
        "severity_hint": 0.8,
    },
    "Hope": {
        "aliases": ["hope", "optimism", "expectation"],
        "neurochemicals": ["dopamine", "serotonin"],
        "half_life_seconds": 15,           # table: 15
        "decay_model": "regenerative",
        "actions": ["extend_thread", "forecast_emotion"],
        "interference": ["Shame"],
        "severity_hint": 0.6,
    },
    "Gratefulness": {
        "aliases": ["grateful", "gratitude"],
        "neurochemicals": ["dopamine", "serotonin"],
        "half_life_seconds": 10,           # table: 10
        "decay_model": "persistent",
        "actions": ["reflect", "reinforce_memory"],
        "interference": [],
        "severity_hint": 0.5,
    },
    "Forgiveness": {
        "aliases": ["forgive", "forgiveness"],
        "neurochemicals": ["oxytocin", "serotonin"],
        "half_life_seconds": 25,           # table: 25
        "decay_model": "release_burst",
        "actions": ["release_bond", "stabilize_core"],
        "interference": ["Anger"],
        "severity_hint": 0.7,
    },
    "Peace": {
        "aliases": ["peace", "calm"],
        "neurochemicals": ["serotonin", "GABA"],
        "half_life_seconds": 30,           # table: 30
        "decay_model": "ambient",
        "actions": ["stabilize_core", "silence_ripple"],
        "interference": ["Anger", "Envy"],
        "severity_hint": 0.75,
    },
    "Longing": {
        "aliases": ["longing", "yearning"],
        "neurochemicals": ["dopamine"],
        "half_life_seconds": 40,           # table: 40
        "decay_model": "recursive",
        "actions": ["pursue", "echo_trace"],
        "interference": ["Gratefulness", "Peace"],
        "severity_hint": 0.6,
    },
    "Envy": {
        "aliases": ["envy", "jealousy"],
        "neurochemicals": ["dopamine", "cortisol"],
        "half_life_seconds": 20,           # table: 20
        "decay_model": "volatile",
        "actions": ["compare", "rupture_thread"],
        "interference": ["Gratefulness", "Love"],
        "severity_hint": 0.65,
    },
    "Shame": {
        "aliases": ["shame", "embarrassment"],
        "neurochemicals": ["cortisol", "norepinephrine"],
        "half_life_seconds": 35,           # table: 35
        "decay_model": "freeze",
        "actions": ["withdraw", "mirror_self"],
        "interference": ["Hope", "Love"],
        "severity_hint": 0.9,
    },
    "Anger": {
        "aliases": ["anger", "rage"],
        "neurochemicals": ["adrenaline", "cortisol"],
        "half_life_seconds": 45,           # table: 45
        "decay_model": "explosive",
        "actions": ["rupture_thread", "seek_peace"],
        "interference": ["Peace", "Forgiveness"],
        "severity_hint": 0.95,
    },
    "Faith": {
        "aliases": ["faith", "belief"],
        "neurochemicals": ["oxytocin", "dopamine"],
        "half_life_seconds": 15,           # table: 15
        "decay_model": "stabilizing",
        "actions": ["anchor", "reinforce_bond"],
        "interference": ["Doubt"],
        "severity_hint": 0.65,
    },
    # Add a few sensible defaults for other emotional states
    "Fear": {
        "aliases": ["fear", "anxiety"],
        "neurochemicals": ["adrenaline", "norepinephrine"],
        "half_life_seconds": 25,
        "decay_model": "explosive",
        "actions": ["alert", "avoid"],
        "interference": ["Love", "Faith"],
        "severity_hint": 0.9,
    },
    "Sadness": {
        "aliases": ["sad", "sorrow"],
        "neurochemicals": ["cortisol", "serotonin_low"],
        "half_life_seconds": 60,
        "decay_model": "slow_fade",
        "actions": ["reflect", "seek_support"],
        "interference": ["Envy", "Anger"],
        "severity_hint": 0.8,
    },
    "Joy": {
        "aliases": ["joy", "happy", "happiness"],
        "neurochemicals": ["dopamine", "endorphins"],
        "half_life_seconds": 25,
        "decay_model": "regenerative",
        "actions": ["celebrate", "share"],
        "interference": ["Shame", "Sadness"],
        "severity_hint": 0.7,
    }
}

# -------------------------
# Utilities
# -------------------------
def validate_profiles(profiles: Dict[str, Dict[str, Any]]) -> List[str]:
    """
    Validate the profiles structure; returns a list of error strings (empty if ok).
    Checks required keys and reasonable numeric ranges.
    """
    errors: List[str] = []
    for name, p in profiles.items():
        if "neurochemicals" not in p or not isinstance(p["neurochemicals"], list):
            errors.append(f"{name}: missing or invalid 'neurochemicals' list")
        if "half_life_seconds" not in p or not isinstance(p["half_life_seconds"], (int, float)) or p["half_life_seconds"] <= 0:
            errors.append(f"{name}: missing or invalid 'half_life_seconds'")
        if "decay_model" not in p or not isinstance(p["decay_model"], str):
            errors.append(f"{name}: missing or invalid 'decay_model'")
        if "actions" not in p or not isinstance(p["actions"], list):
            errors.append(f"{name}: missing or invalid 'actions' list")
        # severity_hint optional but if present must be 0..1
        sh = p.get("severity_hint")
        if sh is not None:
            try:
                shf = float(sh)
                if not (0.0 <= shf <= 1.0):
                    errors.append(f"{name}: 'severity_hint' out of range 0.0..1.0")
            except Exception:
                errors.append(f"{name}: 'severity_hint' not a number")
    return errors


def compute_decay_weight(profile: Dict[str, Any], age_seconds: float) -> float:
    """
    Compute remaining weight (0..1) of an emotion profile given its age in seconds.
    Several decay models implemented; these are heuristic and tunable.
    """
    hl = float(profile.get("half_life_seconds", 30.0))
    model = str(profile.get("decay_model", "slow_fade"))
    age = max(0.0, float(age_seconds))

    # Models:
    if model == "slow_fade":
        # linear-ish: full at age=0, 0 at age=2*half_life
        w = max(0.0, 1.0 - (age / (2.0 * hl)))
        return w
    if model == "regenerative":
        # mild decay with slight regeneration: exponential with small regrowth factor
        decay = math.exp(-age / hl)
        regen = 0.05 * math.sin(age / max(1.0, hl / 5.0))  # small oscillation
        return min(1.0, max(0.0, decay + regen))
    if model == "persistent":
        # very slow exponential decay
        return math.exp(-age / (4.0 * hl))
    if model == "release_burst":
        # spike at start, fast falloff (exponential)
        return math.exp(-age / (0.4 * hl))
    if model == "ambient":
        # extremely long tail
        return math.exp(-age / (8.0 * hl))
    if model == "recursive":
        # long tail with periodic reinforcement heuristic
        base = math.exp(-age / (3.0 * hl))
        pulses = 0.1 * (1 + math.sin(age / max(1.0, hl / 10.0)))
        return min(1.0, base + pulses)
    if model == "volatile":
        # faster decay with some jitter
        return max(0.0, math.exp(-age / (0.7 * hl)))
    if model == "freeze":
        # large initial drop then long low tail
        if age < (0.2 * hl):
            return 0.2  # suppressed
        return math.exp(-(age - 0.2 * hl) / (6.0 * hl))
    if model == "explosive":
        # very quick spike then exponential
        return math.exp(-age / (0.3 * hl))
    if model == "stabilizing":
        # moderate decay but tends toward a baseline
        baseline = 0.25
        return baseline + (1.0 - baseline) * math.exp(-age / (1.5 * hl))

    # default fallback: exponential with half_life
    return math.exp(-age / hl)


def apply_interference(base_weight: float, profile_name: str, active_profiles: Dict[str, float]) -> float:
    """
    Reduce base_weight based on profiles in active_profiles that interfere with profile_name.
    active_profiles is mapping profile_name->current_weight (0..1).
    Interference is symmetric; we reduce by sum(influence * factor).
    """
    profile = emotion_profiles.get(profile_name, {})
    inter = profile.get("interference", []) or []
    reduction = 0.0
    for other, w in active_profiles.items():
        if other in inter or profile_name in (emotion_profiles.get(other, {}).get("interference") or []):
            # factor depends on other severity_hint if present
            other_sev = float(emotion_profiles.get(other, {}).get("severity_hint", 0.5))
            # apply scaled reduction
            reduction += float(w) * (0.4 * other_sev)
    new_weight = max(0.0, base_weight - reduction)
    return new_weight


def recommend_actions(profile_name: str) -> List[str]:
    """
    Return action pipeline for profile_name (empty list if unknown).
    """
    return list(emotion_profiles.get(profile_name, {}).get("actions") or [])


# -------------------------
# Example/demo utilities
# -------------------------
def demo_compute(profile_key: str, ages: List[float], active_profiles: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    """
    Demo helper: compute decay weights for multiple ages and optionally apply interference.
    Returns a dict with raw weights and adjusted weights.
    """
    p = emotion_profiles.get(profile_key)
    if p is None:
        raise KeyError(f"Unknown profile: {profile_key}")
    out = {"profile": profile_key, "ages": ages, "raw": [], "adjusted": []}
    active_profiles = active_profiles or {}
    for a in ages:
        raw = compute_decay_weight(p, a)
        adjusted = apply_interference(raw, profile_key, active_profiles)
        out["raw"].append(raw)
        out["adjusted"].append(adjusted)
    return out


if __name__ == "__main__":
    # quick self-test / demo
    import argparse
    parser = argparse.ArgumentParser(description="Emotion profiles demo and validation")
    parser.add_argument("--list", action="store_true", help="List available profiles")
    parser.add_argument("--validate", action="store_true", help="Run validation")
    parser.add_argument("--demo", nargs=2, metavar=("PROFILE", "AGE_SECONDS"), help="Compute weight for profile at age")
    args = parser.parse_args()
    if args.list:
        for k in sorted(emotion_profiles.keys()):
            print(k, "aliases=", emotion_profiles[k].get("aliases"))
    if args.validate:
        errs = validate_profiles(emotion_profiles)
        if errs:
            print("Validation errors:")
            for e in errs:
                print(" -", e)
        else:
            print("All profiles validated OK")
    if args.demo:
        prof = args.demo[0]
        age = float(args.demo[1])
        try:
            res = demo_compute(prof, [age])
            print(json.dumps(res, indent=2))
        except KeyError as ke:
            print("Error:", ke)