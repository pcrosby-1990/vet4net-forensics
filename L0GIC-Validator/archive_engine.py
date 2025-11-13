# archive_engine.py
# Version 1.0 — Archive Engine for encoding terrain memory fragments

import json
from datetime import datetime

def encode_fragment(emotion_input, glyphs):
    # Dynamically calculate resonance level
    resonance_level = round(0.8 + 0.03 * len(glyphs), 2)

    # Determine elemental zone based on dominant glyph element
    element_counts = {}
    for glyph in glyphs:
        element = glyph.element
        element_counts[element] = element_counts.get(element, 0) + 1

    elemental_zone = max(element_counts, key=element_counts.get) if element_counts else "Unknown"

    # Build memory fragment
    fragment = {
        "timestamp": datetime.now().isoformat(),
        "location": "Fusion Threshold — Spokane, WA",
        "emotion": emotion_input,
        "elemental_zone": elemental_zone,
        "glyphs_activated": [glyph.name for glyph in glyphs],
        "resonance_level": resonance_level,
        "terrain_status": "Stable",
        "containment": "Engaged",
        "fragment_log": generate_log(emotion_input, glyphs)
    }

    # Load existing archive or create new
    try:
        with open("terrain_archive.json", "r") as archive:
            data = json.load(archive)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []

    data.append(fragment)

    # Write updated archive
    with open("terrain_archive.json", "w") as archive:
        json.dump(data, archive, indent=2)

    print("📝 Memory fragment encoded into terrain archive.")

def generate_log(emotion_input, glyphs):
    glyph_names = ", ".join(g.name for g in glyphs)
    return f"The glyphs [{glyph_names}] responded to '{emotion_input}'. The terrain remembered."
