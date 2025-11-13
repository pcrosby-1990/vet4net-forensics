import os
import csv
import json
import hashlib
import uuid
import argparse
from datetime import datetime
from dotenv import load_dotenv
from nacl.signing import SigningKey
from nacl.encoding import HexEncoder
from snapshot_validator.watermark_tool import embed_stamp, verify_signature
from PIL import Image
import qrcode
from flask import Flask, jsonify, request, send_file

# === STEP 1: Parse CLI Arguments ===
parser = argparse.ArgumentParser(description="Stamp images and export metadata with filters.")
parser.add_argument("--badge", type=str, help="Filter by badge level (e.g. gold)")
parser.add_argument("--validator", type=str, help="Filter by validator name")
parser.add_argument("--start", type=str, help="Start date (YYYY-MM-DD)")
parser.add_argument("--end", type=str, help="End date (YYYY-MM-DD)")
parser.add_argument("--web", action="store_true", help="Launch web interface for metadata export")
parser.add_argument("--validate", action="store_true", help="Run batch validation on stamped images")
args = parser.parse_args()

# === STEP 2: Load private key ===
load_dotenv(dotenv_path="D:/Forensics-l0gic-validation/L0GIC-Validator/.env")
private_key_hex = os.getenv("PRIVATE_KEY")
if not private_key_hex:
    raise ValueError("❌ PRIVATE_KEY not found in .env file.")

signing_key = SigningKey(bytes.fromhex(private_key_hex))
verify_key = signing_key.verify_key
public_key_hex = verify_key.encode(encoder=HexEncoder).decode()

# === STEP 3: Config ===
INPUT_FOLDER = "assets/to_stamp/input"
OUTPUT_FOLDER = "assets/stamped"
LOG_PATH = "assets/stamped_log.csv"
BADGE_CSV = "assets/badge_levels.csv"
METADATA_CSV = "assets/stamped_metadata.csv"
METADATA_JSON = "assets/stamped_metadata.json"
FILTERED_CSV = "assets/filtered_metadata.csv"
FILTERED_JSON = "assets/filtered_metadata.json"
STAMPED_BY = "Patrick Crosby"
PUBLIC_KEY_URL = "https://etherscan.io/address/0x74191d893DB82BE9955Ed5fB95fe2d8F69D35395"
VALID_BADGES = {"iron", "silver", "gold", "emerald", "diamond"}

def generate_fingerprint(public_key_hex):
    digest = hashlib.sha256(bytes.fromhex(public_key_hex)).hexdigest()
    return f"ed25519: {digest[:8]}...{digest[-4:]}"

FINGERPRINT = generate_fingerprint(public_key_hex)

def hash_file(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

def generate_qr_code(url):
    qr = qrcode.QRCode(version=1, box_size=4, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    return qr.make_image(fill="black", back_color="white").convert("RGBA")

def load_badge_metadata(csv_path):
    badge_dict = {}
    if os.path.exists(csv_path):
        with open(csv_path, newline="") as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if len(row) >= 2:
                    filename, level = row[0].strip(), row[1].strip().lower()
                    badge_dict[filename] = level
    return badge_dict

def infer_badge_level(filename):
    name = filename.lower()
    for level in VALID_BADGES:
        if level in name:
            return level
    return "iron"

badge_metadata = load_badge_metadata(BADGE_CSV)

def view_metadata(image_path):
    try:
        img = Image.open(image_path)
        metadata = img.text
        print(f"\n📄 Metadata for: {os.path.basename(image_path)}")
        for key, value in metadata.items():
            print(f"🔹 {key}: {value}")
        return {
            "filename": os.path.basename(image_path),
            "metadata": metadata
        }
    except Exception as e:
        print(f"❌ Failed to read metadata from {image_path}: {e}")
        return {}

def export_metadata_to_csv(metadata_dict, path):
    with open(path, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Filename", "Key", "Value"])
        for filename, metadata in metadata_dict.items():
            for key, value in metadata.items():
                writer.writerow([filename, key, value])

def export_metadata_to_json(metadata_dict, path):
    with open(path, "w") as jsonfile:
        json.dump(metadata_dict, jsonfile, indent=2)

def filter_metadata(all_metadata, badge=None, validator=None, start_date=None, end_date=None):
    filtered = {}
    for entry in all_metadata.values():
        meta = entry.get("metadata", {})
        ts = meta.get("ValidationTimestamp", "")
        badge_level = meta.get("BadgeLevel", "").lower()
        validator_name = meta.get("ValidatorName", "")

        if badge and badge_level != badge.lower():
            continue
        if validator and validator_name != validator:
            continue
        if start_date or end_date:
            try:
                ts_obj = datetime.strptime(ts.split(" ")[0], "%Y-%m-%d")
                if start_date and ts_obj < datetime.strptime(start_date, "%Y-%m-%d"):
                    continue
                if end_date and ts_obj > datetime.strptime(end_date, "%Y-%m-%d"):
                    continue
            except:
                continue

        filtered[entry["filename"]] = meta
    return filtered

os.makedirs(OUTPUT_FOLDER, exist_ok=True)
all_metadata = {}

with open(LOG_PATH, "w", newline="") as logfile:
    writer = csv.writer(logfile)
    writer.writerow(["Filename", "Timestamp", "SHA256", "ValidationID", "ValidatedCount", "Signature", "Fingerprint", "BadgeLevel"])

    validated_count = 0

    for filename in os.listdir(INPUT_FOLDER):
        if filename.lower().endswith((".png", ".jpg", ".jpeg")):
            validated_count += 1
            input_path = os.path.join(INPUT_FOLDER, filename)
            output_path = os.path.join(OUTPUT_FOLDER, f"stamped_{filename}")
            print(f"🔧 Stamping {input_path} → {output_path}")

            now = datetime.now()
            timestamp = now.strftime("%Y-%m-%d %H:%M:%S PDT")
            validation_id = str(uuid.uuid4())[:8]
            image_hash = hash_file(input_path)
            message = f"{image_hash}|{timestamp}"
            signature = signing_key.sign(message.encode()).signature.hex()

            qr_img = generate_qr_code(PUBLIC_KEY_URL)

            badge_level = badge_metadata.get(filename) or infer_badge_level(filename)
            if badge_level not in VALID_BADGES:
                badge_level = "iron"

            embed_stamp(
                input_path=input_path,
                output_path=output_path,
                full_name=STAMPED_BY,
                fingerprint=FINGERPRINT,
                validated_count=validated_count,
                validation_id=validation_id,
                signature=signature,
                metadata_url=PUBLIC_KEY_URL,
                qr_img=qr_img,
                validator_level=badge_level,
                badge_metadata=badge_metadata,
                public_key_hex=public_key_hex
            )

            result = view_metadata(output_path)
            all_metadata[result["filename"]] = result["metadata"]

            writer.writerow([filename, timestamp, image_hash, validation_id, validated_count, signature, FINGERPRINT, badge_level])
            print(f"✅ Done: {output_path} | ID: {validation_id} | Badge: {badge_level} | Count: {validated_count}")

            try:
                os.remove(input_path)
                print(f"🧹 Removed original file: {input_path}")
            except Exception as e:
                print(f"❌ Failed to delete {input_path}: {e}")

export_metadata_to_csv(all_metadata, METADATA_CSV)
export_metadata_to_json(all_metadata, METADATA_JSON)
print("📤 Metadata exported to CSV and JSON.")

filtered = filter_metadata(
    all_metadata,
    badge=args.badge,
    validator=args.validator,
    start_date=args.start,
    end_date=args.end
)

print("\n🔎 Filtered Preview:")
for fname, meta in filtered.items():
    print(f"\n📁 {fname}")
    for k, v in meta.items():
        print(f"   {k}: {v}")

export_metadata_to_csv(filtered, FILTERED_CSV)
export_metadata_to_json(filtered, FILTERED_JSON)
print("📤 Filtered metadata exported.")

def validate_stamped_images(folder, public_key_hex):
    print("\n🔍 Batch Validation Report")
    for filename in os.listdir(folder):
        if filename.lower().endswith(".png"):
            path = os.path.join(folder, filename)
            try:
                img = Image.open(path)
                metadata = img.text
                record = metadata.get("ValidationRecord", "")
                original_hash = record.split("Hash: ")[-1].split