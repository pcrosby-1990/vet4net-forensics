from PIL import Image

img = Image.open("assets/stamped/stamped_photo1.png")
metadata = img.text.get("ValidationRecord")
print(metadata)
