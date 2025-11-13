import os
from PIL import Image

# === Config ===
SOURCE_IMAGE = "glyph_sheet.png"
GLYPH_DIR = "glyphs"
GLYPH_WIDTH = 64
GLYPH_HEIGHT = 64
COLUMNS = 32
ROWS = 32

# === Load Source Sheet ===
sheet = Image.open(SOURCE_IMAGE)
os.makedirs(GLYPH_DIR, exist_ok=True)

# === Crop and Save Glyphs ===
count = 0
for row in range(ROWS):
    for col in range(COLUMNS):
        left = col * GLYPH_WIDTH
        upper = row * GLYPH_HEIGHT
        right = left + GLYPH_WIDTH
        lower = upper + GLYPH_HEIGHT

        glyph = sheet.crop((left, upper, right, lower))
        filename = f"{count+1:05}.png"
        glyph.save(os.path.join(GLYPH_DIR, filename))
        count += 1

print(f"✅ Cropped {count} glyphs to {GLYPH_DIR}/")
