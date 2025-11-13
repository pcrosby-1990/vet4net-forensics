#!/usr/bin/env python3
"""
sensory_engine.py — upgraded sensory profiling and trace binding

Improvements made:
- Added type hints and docstrings for clarity.
- Accepts either list[str] of emotion names or list[tuple[str, float]]
  where each tuple is (emotion, weight) to support severity-weighted emotions.
- Normalizes counts to allow combining weighted and unweighted inputs.
- Uses emotion_profiles (if available) to derive default weights/severity hints.
- Provides safe handling for empty inputs and ties (deterministic, stable sort).
- forecast_shift now returns full delta map and top changes (n) and supports
  using different profile functions.
- bind_sensory_trace returns top-N traces per sense and optional confidence.
- Adds utilities: normalize_emotions, top_n_keys, merge_profiles.
- Includes basic CLI demo and a small self-test when run as __main__.
"""

from __future__ import annotations

import json
import logging
from collections import defaultdict, Counter
from typing import Callable, Dict, Iterable, List, Mapping, Optional, Sequence, Tuple, Union

logger = logging.getLogger("sensory_engine")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

# Type aliases
Emotion = str
Weight = float
EmotionInput = Union[Emotion, Tuple[Emotion, Weight]]
WeightedEmotions = Mapping[Emotion, Weight]
Profile = Dict[str, int]


# Try to import canonical emotion_profiles if present (optional)
try:
    from emotion_profiles import EMOTION_PROFILES  # type: ignore
except Exception:
    EMOTION_PROFILES = {}  # type: ignore


def normalize_emotions(emotions: Iterable[EmotionInput]) -> Dict[Emotion, Weight]:
    """
    Normalize an iterable of emotions into a mapping emotion->weight.
    Accepts:
      - simple strings: each counts as weight 1.0
      - (emotion, weight) tuples: use provided weight
    If an emotion has a severity_hint in EMOTION_PROFILES and weight is 1.0,
    the severity_hint is applied multiplicatively to produce a more nuanced weight.
    """
    out: Dict[Emotion, Weight] = defaultdict(float)
    for e in emotions:
        if isinstance(e, tuple) and len(e) >= 2:
            name, w = e[0], float(e[1])
        else:
            name, w = str(e), 1.0
            # apply severity_hint when available for single-count inputs
            meta = EMOTION_PROFILES.get(name)
            if meta and isinstance(meta.get("severity_hint"), (int, float)):
                w = w * float(meta["severity_hint"])
        out[name] += w
    return dict(out)


def _weighted_profile(scores: Dict[Emotion, Weight], mapping: Mapping[str, Sequence[str]]) -> Dict[str, float]:
    """
    Generic helper: given weighted emotion scores and a mapping from sense-key -> list of emotions
    compute sense scores: sum of matching emotion weights for each sense key.
    mapping example (taste_map): { "Sweet": ["Love","Gratefulness"], ... }
    """
    result: Dict[str, float] = {k: 0.0 for k in mapping.keys()}
    for sense, mapped_emotions in mapping.items():
        s = 0.0
        for em in mapped_emotions:
            s += float(scores.get(em, 0.0))
        result[sense] = s
    return result


# Default sense mappings (kept similar to original but structured)
DEFAULT_TASTE_MAP: Dict[str, List[str]] = {
    "Sweet": ["Love", "Gratefulness"],
    "Bitter": ["Shame", "Longing"],
    "Umami": ["Peace", "Faith"],
    "Sour": ["Anger", "Envy"],
    "Salty": ["Forgiveness", "Hope"],
}

DEFAULT_SCENT_MAP: Dict[str, List[str]] = {
    "Floral": ["Love", "Gratefulness"],
    "Earthy": ["Faith", "Peace"],
    "Spicy": ["Anger", "Envy"],
    "Fresh": ["Hope", "Forgiveness"],
    "Rot": ["Shame", "Longing"],
}

DEFAULT_TOUCH_MAP: Dict[str, List[str]] = {
    "Soft": ["Love", "Gratefulness"],
    "Firm": ["Faith", "Anger"],
    "Cold": ["Shame", "Longing"],
    "Warm": ["Hope", "Forgiveness"],
    "Still": ["Peace"],
    "Sharp": ["Envy", "Anger"],
}


def get_taste_profile(emotions: Iterable[EmotionInput], mapping: Mapping[str, Sequence[str]] = DEFAULT_TASTE_MAP) -> Dict[str, float]:
    """
    Return taste profile scores for the provided emotions.
    Emotions may be weighted tuples or plain strings.
    """
    scores = normalize_emotions(emotions)
    return _weighted_profile(scores, mapping)


def get_scent_profile(emotions: Iterable[EmotionInput], mapping: Mapping[str, Sequence[str]] = DEFAULT_SCENT_MAP) -> Dict[str, float]:
    scores = normalize_emotions(emotions)
    return _weighted_profile(scores, mapping)


def get_touch_profile(emotions: Iterable[EmotionInput], mapping: Mapping[str, Sequence[str]] = DEFAULT_TOUCH_MAP) -> Dict[str, float]:
    scores = normalize_emotions(emotions)
    return _weighted_profile(scores, mapping)


def top_n_keys(d: Mapping[str, float], n: int = 1) -> List[Tuple[str, float]]:
    """
    Return top-n items from mapping sorted by value desc, tie-broken by key (stable).
    """
    if not d:
        return []
    items = sorted(d.items(), key=lambda kv: (-kv[1], kv[0]))
    return items[:max(1, n)]


def forecast_shift(
    profile_fn: Callable[[Iterable[EmotionInput]], Dict[str, float]],
    emotions_before: Iterable[EmotionInput],
    emotions_after: Iterable[EmotionInput],
    top_n: int = 3,
) -> Dict[str, object]:
    """
    Compute full delta map between before and after profiles using profile_fn.
    Returns dict:
      {
        "delta": {key: change, ...},
        "top_increases": [(key, delta), ...],
        "top_decreases": [(key, delta), ...],
        "before": {...},
        "after": {...}
      }
    """
    before = profile_fn(emotions_before)
    after = profile_fn(emotions_after)
    keys = set(before.keys()) | set(after.keys())
    delta: Dict[str, float] = {}
    for k in keys:
        delta[k] = round(after.get(k, 0.0) - before.get(k, 0.0), 6)
    # sort increases and decreases
    increases = sorted(((k, v) for k, v in delta.items() if v > 0), key=lambda kv: (-kv[1], kv[0]))[:top_n]
    decreases = sorted(((k, v) for k, v in delta.items() if v < 0), key=lambda kv: (kv[1], kv[0]))[:top_n]
    return {"delta": delta, "top_increases": increases, "top_decreases": decreases, "before": before, "after": after}


def bind_sensory_trace(
    memory_node: str,
    emotions: Iterable[EmotionInput],
    taste_map: Mapping[str, Sequence[str]] = DEFAULT_TASTE_MAP,
    scent_map: Mapping[str, Sequence[str]] = DEFAULT_SCENT_MAP,
    touch_map: Mapping[str, Sequence[str]] = DEFAULT_TOUCH_MAP,
    top_n: int = 1,
) -> Dict[str, object]:
    """
    Create a bound sensory trace for the given memory node.
    Returns:
      {
        "memory_node": ...,
        "taste_trace": [(k, score), ...],
        "scent_trace": [...],
        "touch_trace": [...],
        "profiles": {taste: {...}, scent: {...}, touch: {...}},
        "bound_emotions": {emotion: weight, ...}
      }
    """
    weighted = normalize_emotions(emotions)
    taste = _weighted_profile(weighted, taste_map)
    scent = _weighted_profile(weighted, scent_map)
    touch = _weighted_profile(weighted, touch_map)

    taste_top = top_n_keys(taste, top_n)
    scent_top = top_n_keys(scent, top_n)
    touch_top = top_n_keys(touch, top_n)

    # compute simple confidence: top score normalized over sum
    def _confidence(top_list: List[Tuple[str, float]], full_map: Dict[str, float]) -> float:
        if not top_list:
            return 0.0
        total = sum(full_map.values()) or 1.0
        return round(sum(score for _, score in top_list) / total, 4)

    return {
        "memory_node": memory_node,
        "taste_trace": taste_top,
        "scent_trace": scent_top,
        "touch_trace": touch_top,
        "profiles": {"taste": taste, "scent": scent, "touch": touch},
        "confidences": {
            "taste": _confidence(taste_top, taste),
            "scent": _confidence(scent_top, scent),
            "touch": _confidence(touch_top, touch),
        },
        "bound_emotions": weighted,
    }


# Convenience: merge multiple sensory profiles (averaging or summing)
def merge_profiles(profiles: Sequence[Profile], method: str = "sum") -> Profile:
    """
    Merge a sequence of profiles (mapping sense->score).
    method: "sum" or "avg"
    """
    acc: Dict[str, float] = defaultdict(float)
    for p in profiles:
        for k, v in p.items():
            acc[k] += float(v)
    if method == "avg" and profiles:
        n = len(profiles)
        return {k: v / n for k, v in acc.items()}
    return {k: v for k, v in acc.items()}


# -------------------------
# CLI / Demo
# -------------------------
def _demo():
    before = ["Love", "Hope", ("Faith", 0.8)]
    after = ["Anger", "Envy", "Shame", ("Love", 0.3)]

    print("Taste Shift:")
    print(json.dumps(forecast_shift(get_taste_profile, before, after), ensure_ascii=False, indent=2))

    print("\nScent Shift:")
    print(json.dumps(forecast_shift(get_scent_profile, before, after), ensure_ascii=False, indent=2))

    print("\nTouch Shift:")
    print(json.dumps(forecast_shift(get_touch_profile, before, after), ensure_ascii=False, indent=2))

    print("\nBound Sensory Trace:")
    print(json.dumps(bind_sensory_trace("memory_node_99", after, top_n=2), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    _demo()