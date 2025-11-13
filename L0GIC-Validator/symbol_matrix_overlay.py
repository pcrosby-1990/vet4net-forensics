import json
import os
from PIL import Image
import matplotlib.pyplot as plt

# === Config ===
MAP_PATH = "symbol_map_deduped.json"
GLYPH_DIR = "glyphs"
OUTPUT_IMAGE = "realm_tier_matrix.png"
CELL_SIZE = (80, 80)  # Width, height of each glyph

# === Load Symbol Map ===
with open(MAP_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

symbols = list(data.get("map", {}).values())

# === Extract Realms and Tiers ===
realms = sorted(set(s.get("realm", "Unknown") for s in symbols))
tiers = sorted(set(s.get("tier", "Unknown") for s in symbols))

# === Create Matrix Grid ===
fig, axs = plt.subplots(len(realms), len(tiers), figsize=(len(tiers)*2, len(realms)*2))

for i, realm in enumerate(realms):
    for j, tier in enumerate(tiers):
        group = [
            s for s in symbols
            if s.get("realm") == realm and s.get("tier") == tier and s.get("image")
        ]
        axs[i, j].axis("off")
        axs[i, j].set_title(f"{realm} · {tier}", fontsize=8)

        if group:
            # Pick glyph with lowest entropy
            glyph = sorted(group, key=lambda s: s.get("entropy", 0))[0]
            glyph_path = os.path.join(GLYPH_DIR, os.path.basename(glyph["image"]))
            if os.path.exists(glyph_path):
                img = Image.open(glyph_path).resize(CELL_SIZE)
                axs[i, j].imshow(img)

# === Save Output ===
plt.tight_layout()
plt.savefig(OUTPUT_IMAGE)
print(f"✅ Matrix saved to {OUTPUT_IMAGE}")
