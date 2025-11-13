from PIL import Image
import os

STAMPED_FOLDER = "assets/stamped"

def view_metadata(image_path):
    try:
        img = Image.open(image_path)
        metadata = img.text  # Extract PNGInfo text chunks
        print(f"\n📄 Metadata for: {os.path.basename(image_path)}")
        for key, value in metadata.items():
            print(f"🔹 {key}: {value}")
    except Exception as e:
        print(f"❌ Failed to read metadata from {image_path}: {e}")

def scan_folder(folder_path):
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(".png"):
            full_path = os.path.join(folder_path, filename)
            view_metadata(full_path)

if __name__ == "__main__":
    scan_folder(STAMPED_FOLDER)
