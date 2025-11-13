from PIL import Image
import os

# Create the folder if it doesn't exist
os.makedirs("assets/to_stamp", exist_ok=True)

# Generate 3 blank images
for i in range(3):
    img = Image.new("RGB", (800, 600), color=(200, 200, 200))  # light gray
    img.save(f"assets/to_stamp/test_blank_{i+1}.png")

print("✅ Blank test images created.")
