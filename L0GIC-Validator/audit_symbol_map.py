import json
import os

MAP_PATH = "symbol_map_deduped.json"
GLYPH_DIR = "glyphs"

with open(MAP_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

symbols = data.get("map", {})
missing = []

for uid, sym in symbols.items():
    image = sym.get("image")
    if not image:
        missing.append((uid, "No image field"))
        continue

    glyph_path = os.path.join(GLYPH_DIR, os.path.basename(image))
    if not os.path.exists(glyph_path):
        missing.append((uid, f"Missing file: {glyph_path}"))

print(f"\n🧠 Total symbols: {len(symbols)}")
print(f"❌ Missing glyphs: {len(missing)}")
for uid, reason in missing[:20]:
    print(f"- {uid}: {reason}")
