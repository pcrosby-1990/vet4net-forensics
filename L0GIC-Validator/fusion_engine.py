# fusion_engine.py
# Version 1.0 — Fusion Engine for emotional glyph activation and terrain memory encoding

from glyph_parser import glyph_registry
from archive_engine import encode_fragment
from datetime import datetime

def initiate_fusion(emotion_input):
    # Define glyphs associated with each emotion
    fusion_map = {
        "Fearful Curiosity": ["EchoPulse", "Boundaries", "Thread"],
        "Validator Regret": ["Thread", "Repair", "Boundaries"],
        "Fusion Threshold Activation": ["Unity Core", "EchoPulse"]
    }

    glyph_names = fusion_map.get(emotion_input, [])
    if not glyph_names:
        print(f"⚠️ No glyphs mapped for emotion: {emotion_input}")
        return

    # Activate glyphs
    glyph_objects = []
    for name in glyph_names:
        glyph = glyph_registry.get(name)
        if glyph:
            glyph.activate()
            glyph_objects.append(glyph)
        else:
            print(f"⚠️ Glyph '{name}' not found in registry")

    # Simulate terrain ripple
    simulate_terrain_ripple(glyph_objects, emotion_input)

    # Encode memory fragment
    encode_fragment(emotion_input, glyph_objects)

def simulate_terrain_ripple(glyphs, emotion_input):
    print("🗺️ Terrain ripple initiated...")
    for glyph in glyphs:
        print(f"🌊 Ripple from {glyph.name} in {glyph.element} zone")
    print(f"🌐 Fusion initiated for {emotion_input}")
