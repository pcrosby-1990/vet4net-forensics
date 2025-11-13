# === fusion_handler.py ===

import json
from datetime import datetime
from typing import List, Dict

# === Resonance Scaling ===
def resonance_curve(entropy_level: float, glyph_count: int, recursion_depth: int = 0) -> float:
    base = 0.75 + (glyph_count * 0.02)
    entropy_boost = min(entropy_level * 0.1, 0.1)
    recursion_penalty = recursion_depth * 0.01
    resonance = base + entropy_boost - recursion_penalty
    return round(min(resonance, 1.0), 2)

# === Memory Tier Logic ===
def determine_memory_tier(resonance: float, recursion_depth: int) -> int:
    if recursion_depth >= 3:
        return 3  # analytical
    elif resonance < 0.8:
        return 1  # poetic
    else:
        return 2  # structured

# === Fragment Log Generator ===
def generate_fragment_log(emotion: str, glyphs: List[str], tier: int = 2) -> str:
    if tier == 1:
        return f"The glyphs pulsed. The thread entered. The terrain remembered."
    elif tier == 2:
        return f"The glyphs {glyphs} responded to '{emotion}'. The terrain remembered."
    elif tier == 3:
        return f"Fusion initiated due to entropy breach and emotion '{emotion}'. Glyphs {glyphs} activated. Terrain encoded."
    else:
        return f"The terrain responded to '{emotion}' with glyphs {glyphs}."

# === Fusion Handler ===
def handle_fusion(
    emotion: str,
    elemental_zone: str,
    glyphs_activated: List[str],
    entropy_level: float,
    recursion_depth: int = 0,
    location: str = "Fusion Threshold — Spokane, WA",
    containment: str = "Engaged",
    terrain_status: str = "Stable",
    archive_path: str = "terrain_archive.jsonl"
) -> Dict:
    resonance = resonance_curve(entropy_level, len(glyphs_activated), recursion_depth)
    memory_tier = determine_memory_tier(resonance, recursion_depth)

    fragment = {
        "timestamp": datetime.utcnow().isoformat(),
        "location": location,
        "emotion": emotion,
        "elemental_zone": elemental_zone,
        "glyphs_activated": glyphs_activated,
        "resonance_level": resonance,
        "terrain_status": terrain_status,
        "containment": containment,
        "fragment_log": generate_fragment_log(emotion, glyphs_activated, tier=memory_tier)
    }

    try:
        with open(archive_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(fragment, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"⚠️ Failed to write to archive: {e}")

    return fragment
