from PIL import Image, ImageDraw, ImageFont
from datetime import datetime
import uuid

def create_stamp(output_path="assets/stamp.png", full_name="Patrick Crosby", fingerprint="ed25519: 9f2a...c7e1", validated_count=1, validation_id=None):
    if not full_name or len(full_name.strip().split()) < 2:
        raise ValueError("Full name (first and last) is required for validated stamps.")

    if not validation_id:
        validation_id = str(uuid.uuid4())[:8]

    img = Image.new("RGBA", (440, 200), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("arialbd.ttf", 20)
    except:
        font = ImageFont.load_default()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S PDT")

    draw.text((15, 10), full_name, fill="black", font=font)
    draw.text((15, 40), fingerprint, fill="black", font=font)
    draw.text((15, 70), "LOGIC-Validator", fill="black", font=font)
    draw.text((15, 100), f"Files Validated: {validated_count} as of {timestamp}", fill="black", font=font)
    draw.text((15, 130), f"Validation ID: {validation_id}", fill="black", font=font)
    draw.rectangle([(0, 0), (439, 199)], outline="black", width=2)

    img.save(output_path, format="PNG")
    print(f"✅ Stamp created: {output_path} | ID: {validation_id} | Count: {validated_count}")

# Run it
create_stamp()
