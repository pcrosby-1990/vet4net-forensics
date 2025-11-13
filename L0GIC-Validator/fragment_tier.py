# === fragment_tier.py ===

import json
from datetime import datetime
from collections import Counter

# === Tier Computation Logic ===
def compute_tier(fragment: dict, tier_map: dict = None) -> int:
    """
    Computes symbolic tier for a fragment using either internal rules or external tier map.
    """
    entropy = fragment.get("entropy_level", 0.42)
    recursion = fragment.get("recursion_depth", 0)
    glyphs = fragment.get("glyphs_activated", [])
    emotion = fragment.get("emotion")

    # External tier map override
    if tier_map:
        if emotion in tier_map.get("emotion_tiers", {}):
            return tier_map["emotion_tiers"][emotion]
        for glyph in glyphs:
            if glyph in tier_map.get("glyph_tiers", {}):
                return tier_map["glyph_tiers"][glyph]
        if entropy >= tier_map.get("entropy_thresholds", {}).get("tier_3", 0.8):
            return 3
        elif entropy >= tier_map.get("entropy_thresholds", {}).get("tier_2", 0.5):
            return 2
        return tier_map.get("default", 1)

    # Internal logic fallback
    if entropy > 0.7 and recursion >= 4 and any(g in glyphs for g in ["Repair", "Mirror", "Seal"]):
        return 3
    if entropy > 0.5 and recursion >= 2 and len(glyphs) >= 3:
        return 2
    return 1

# === Tier Map Loader ===
def load_tier_map(path: str = "tier_list.json") -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        print(f"⚠️ Failed to load tier map from {path}")
        return {}

# === Load Archive and Assign Tiers ===
def load_fragments_with_tiers(path: str = "terrain_archive.jsonl", tier_map: dict = None) -> list:
    fragments = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    fragment = json.loads(line)
                    fragment["tier"] = compute_tier(fragment, tier_map)
                    fragments.append(fragment)
                except Exception:
                    continue
    except FileNotFoundError:
        print(f"⚠️ Archive not found at {path}")
    return fragments

# === Tier Distribution Report ===
def report_tier_distribution(fragments: list):
    tier_counts = Counter(f["tier"] for f in fragments)
    print("\n📊 Fragment Tier Distribution")
    print("-----------------------------")
    for tier in sorted(tier_counts):
        print(f"  Tier {tier}: {tier_counts[tier]} fragments")

# === Surface High-Tier Fragments ===
def surface_high_tier_fragments(fragments: list, limit: int = 5):
    tier3 = [f for f in fragments if f["tier"] == 3]
    print("\n🔮 High-Tier Fragments (Tier 3)")
    print("-----------------------------")
    for frag in tier3[:limit]:
        ts = frag.get("timestamp", "unknown")
        emotion = frag.get("emotion", "unknown")
        glyphs = ", ".join(frag.get("glyphs_activated", []))
        print(f"  - {emotion} @ {ts} → Glyphs: {glyphs}")

# === Run Full Tier Audit ===
def run_fragment_tier_audit():
    tier_map = load_tier_map()
    fragments = load_fragments_with_tiers(tier_map=tier_map)
    report_tier_distribution(fragments)
    surface_high_tier_fragments(fragments)
