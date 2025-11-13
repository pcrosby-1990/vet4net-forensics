#!/usr/bin/env python3
"""
Run: python assign_crop_glyphs.py
Assigns crop glyph images directly into symbol_map_deduped.json
"""

import json
import os

# === Config ===
MAP_PATH = "symbol_map_deduped.json"
GLYPH_DIR = "glyphs"
GLYPH_COUNT = 8928

# === Load Symbol Map ===
with open(MAP_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

symbol_map = data.get("map", {})
uids = list(symbol_map.keys())

# === Assign Glyphs ===
for i, uid in enumerate(uids):
    glyph_index = (i % GLYPH_COUNT) + 1
    glyph_file = f"{glyph_index:05}.png"
    symbol_map[uid]["image"] = f"{GLYPH_DIR}/{glyph_file}"

# === Save Updated Map ===
with open(MAP_PATH, "w", encoding="utf-8") as f:
    json.dump({**data, "map": symbol_map}, f, indent=2, ensure_ascii=False)

print(f"\n✅ Embedded {len(uids)} crop glyphs into {MAP_PATH}")
print(f"🖼️ Glyphs sourced from: {GLYPH_DIR}/00001.png → {GLYPH_DIR}/{GLYPH_COUNT:05}.png")
