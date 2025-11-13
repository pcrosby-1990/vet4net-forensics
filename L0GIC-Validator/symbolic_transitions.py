import json
import os
from PIL import Image
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# === Config ===
MAP_PATH = "symbol_map_deduped.json"
GLYPH_DIR = "glyphs"
TARGET_REALM = "meta"  # Change this to animate a different realm
OUTPUT_GIF = f"symbol_transition_{TARGET_REALM}.gif"
FRAME_INTERVAL_MS = 500

# === Load Symbol Map ===
with open(MAP_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

symbols = list(data.get("map", {}).values())

# === Filter and Sort by Entropy ===
sequence = [
    s for s in symbols
    if s.get("realm") == TARGET_REALM
    and s.get("image")
    and os.path.exists(os.path.join(GLYPH_DIR, os.path.basename(s["image"])))
]
sequence = sorted(sequence, key=lambda s: s.get("entropy", 0))

if not sequence:
    print(f"⚠️ No valid symbols found for realm '{TARGET_REALM}'")
    exit()

# === Prepare Frames ===
frames = [
    Image.open(os.path.join(GLYPH_DIR, os.path.basename(s["image"])))
    for s in sequence
]

# === Animate ===
fig, ax = plt.subplots()
img = ax.imshow(frames[0])
ax.axis("off")

def update(frame):
    img.set_data(frames[frame])
    uid = sequence[frame].get("uid", "unknown")
    entropy = sequence[frame].get("entropy", 0)
    ax.set_title(f"{uid} · Entropy: {entropy:.2f}", fontsize=10)
    return [img]

ani = FuncAnimation(fig, update, frames=len(frames), interval=FRAME_INTERVAL_MS)
ani.save(OUTPUT_GIF, writer="pillow")

print(f"✅ Animation saved to {OUTPUT_GIF} ({len(frames)} frames)")
