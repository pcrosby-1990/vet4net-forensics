from PIL import Image, ImageDraw, ImageFont
from PIL.PngImagePlugin import PngInfo
from datetime import datetime
import hashlib
import os
import random
from nacl.signing import VerifyKey
from nacl.encoding import HexEncoder

STAMP_VERSION = "v1.0.0"

def create_pnginfo(metadata_string, hidden_watermark):
    meta = PngInfo()
    meta.add_text("ValidationRecord", metadata_string)
    meta.add_text("HiddenWatermark", hidden_watermark)
    meta.add_text("StampVersion", STAMP_VERSION)
    return meta

def hash_image(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

def generate_watermark(full_name, validation_id, timestamp):
    nonce = random.randint(100000, 999999)
    return f"L0GIC-Watermark|Signer:{full_name}|ID:{validation_id}|TS:{timestamp}|Nonce:{nonce}|Stamp:{STAMP_VERSION}"

def verify_signature(public_key_hex, signature_hex, message):
    try:
        verify_key = VerifyKey(public_key_hex, encoder=HexEncoder)
        verify_key.verify(message.encode(), bytes.fromhex(signature_hex))
        return True
    except Exception as e:
        print("❌ Signature verification failed:", e)
        return False

def get_badge_level_from_metadata(filename, metadata_dict):
    return metadata_dict.get(filename, "iron")

def embed_stamp(
    input_path,
    output_path,
    full_name="Patrick Crosby",
    fingerprint="ed25519: 9f2a...c7e1",
    validated_count=1,
    validation_id="00000000",
    signature=None,
    metadata_url="https://etherscan.io/address/0x74191d893DB82BE9955Ed5fB95fe2d8F69D35395",
    qr_img=None,
    validator_level="emerald",
    badge_metadata=None
):
    img = Image.open(input_path).convert("RGBA")
    stamp = Image.new("RGBA", (480, 200), (255, 255, 255, 45))
    draw = ImageDraw.Draw(stamp)

    try:
        font = ImageFont.truetype("fonts/arialbd.ttf", 15)
    except:
        font = ImageFont.load_default()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S PDT")
    original_hash = hash_image(input_path)
    hidden_watermark = generate_watermark(full_name, validation_id, timestamp)
    metadata_string = f"Fingerprint: {fingerprint} | Hash: {original_hash} | URL: {metadata_url}"
    pnginfo = create_pnginfo(metadata_string, hidden_watermark)

    # Auto-verify signature
    if signature:
        pubkey_hex = fingerprint.split(": ")[1].replace("...", "")
        if not verify_signature(pubkey_hex, signature, original_hash):
            print(f"❌ Skipping stamp: Signature invalid for {input_path}")
            return

    # Badge level from metadata
    filename = os.path.basename(input_path)
    if badge_metadata:
        validator_level = get_badge_level_from_metadata(filename, badge_metadata)

    # Stamp layout
    draw.text((15, 10), "L0GIC-Validator", fill="white", font=font)
    draw.text((15, 45), f"Validation ID: {validation_id}", fill="white", font=font)
    draw.text((15, 70), f"Validated by: {full_name}", fill="white", font=font)
    draw.text((15, 95), f"Files Validated: {validated_count} as of {timestamp}", fill="white", font=font)
    draw.text((15, 120), f"Metadata:", fill="white", font=font)

    # Badge
    badge_path = f"assets/badges/{validator_level}_badge.png"
    if not os.path.exists(badge_path):
        badge_path = "assets/badges/default_badge.png"
    if os.path.exists(badge_path):
        badge = Image.open(badge_path).convert("RGBA").resize((40, 40))
        stamp.paste(badge, (420, 10), badge)

    # QR code
    if qr_img:
        stamp.paste(qr_img.resize((60, 60)), (15, 135), qr_img.resize((60, 60)))

    # Composite
    img.paste(stamp, (img.width - 480, img.height - 200), stamp)

    # Save
    try:
        img.save(output_path, format="PNG", pnginfo=pnginfo)
        print("✅ Stamped image saved:", output_path)
    except Exception as e:
        print("❌ Save failed:", e)
