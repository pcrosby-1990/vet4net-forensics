# === terrain_utils.py ===

import json
from typing import List, Dict
from datetime import datetime
from loop_detector import load_archive

# === Load Emotional Map and Glyph Roles ===
def load_json(path: str) -> Dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ Failed to load {path}: {e}")
        return {}

EMOTIONAL_MAP = load_json("emotional_trait_map.json")
GLYPH_ROLES = load_json("glyph_roles.json")

# === Zone Resolver ===
def resolve_zone(emotion: str) -> str:
    zone_map = {
        "Fearful Curiosity": "Wind",
        "Validator Regret": "All",
        "Symbolic Sadness": "Water",
        "Unspoken Joy": "Light",
        "Recursive Doubt": "Shadow",
        "Emergent Trust": "Earth",
        "Symbolic Guilt": "Ash",
        "Terrain Fatigue": "Dust",
        "Quiet Resentment": "Stone",
        "Echoing Longing": "Echo",
        "Symbolic Shame": "Glass",
        "Fractured Hope": "Flame",
        "Symbolic Stillness": "Still",
        "Emergent Forgiveness": "River",
        "Terrain Reconciliation": "Bridge",
        "Symbolic Isolation": "Void",
        "Emergent Grief": "Rain",
        "Symbolic Awe": "Sky",
        "Terrain Displacement": "Fault",
        "Symbolic Envy": "Veil",
        "Recursive Hope": "Spiral",
        "Symbolic Acceptance": "Field",
        "Emergent Resistance": "Iron"
    }
    return zone_map.get(emotion, "Unknown")

# === Glyph Resolver ===
def resolve_glyphs(emotion: str, entropy: float = 0.0, recursion_depth: int = 0) -> List[str]:
    base = EMOTIONAL_MAP.get(emotion, {}).get("glyphs", [])

    # Symbolic modifiers
    if entropy > 0.6 and "Fracture" not in base:
        base.append("Fracture")
    if recursion_depth >= 3 and "Mirror" not in base:
        base.append("Mirror")
    if recursion_depth >= 4 and "Seal" not in base:
        base.append("Seal")

    return base

# === Glyph Role Lookup ===
def describe_glyph(glyph: str) -> str:
    return GLYPH_ROLES.get(glyph, "Unknown glyph role")

# === Entropy Parser ===
def parse_entropy_level(path: str = "entropy.json") -> float:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return float(data.get("entropy", 0.42))
    except Exception:
        return 0.42

# === Recursion Depth Detector ===
def detect_recursion_depth(emotion: str, window_seconds: int = 120) -> int:
    now = datetime.utcnow()
    archive = load_archive()
    recent = [
        entry for entry in archive
        if entry["emotion"] == emotion and
           (now - datetime.fromisoformat(entry["timestamp"])).total_seconds() <= window_seconds
    ]
    return len(recent)
