import os
import hashlib
from PIL import Image
import qrcode
from nacl.signing import VerifyKey
from sign_trace import verify_trace_with_dilithium  # PQC verifier
from hmac_trace import verify_trace_with_hmac       # Optional fallback

# === CONFIGURATION ===
STAMPED_FOLDER = "assets/stamped"
PUBLIC_KEY_HEX = "74191d893DB82BE9955Ed5fB95fe2d8F69D35395"  # Replace with actual key (no 0x prefix)
PUBLIC_KEY_URL = f"https://etherscan.io/address/0x{PUBLIC_KEY_HEX}"

# === STEP 1: Locate stamped image ===
def find_stamped_image():
    files = [f for f in os.listdir(STAMPED_FOLDER) if f.startswith("stamped_") and f.endswith(".png")]
    if not files:
        raise FileNotFoundError("❌ No stamped images found.")
    return os.path.join(STAMPED_FOLDER, files[0])

# === STEP 2: Extract Metadata ===
def extract_metadata(image_path):
    img = Image.open(image_path)
    metadata = img.text.get("ValidationRecord")
    if not metadata:
        raise ValueError("❌ No embedded metadata found.")
    return metadata

# === STEP 3: Parse Metadata Fields ===
def parse_metadata(metadata):
    lines = metadata.split("\n")
    fields = {line.split(": ")[0]: line.split(": ")[1] for line in lines if ": " in line}
    return fields

# === STEP 4: Hash Image ===
def hash_file(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).digest()

# === STEP 5: Verify Signature ===
def verify_signature(digest, signature_hex, public_key_hex, algorithm):
    signature_bytes = bytes.fromhex(signature_hex)
    public_key_bytes = bytes.fromhex(public_key_hex)

    if algorithm.startswith("Dilithium"):
        return verify_trace_with_dilithium(digest, signature_hex, public_key_hex, algorithm)
    elif algorithm == "HMAC-SHA256":
        return verify_trace_with_hmac(digest, signature_hex, public_key_hex)
    elif algorithm == "Ed25519":
        verify_key = VerifyKey(public_key_bytes)
        try:
            verify_key.verify(digest, signature_bytes)
            return True
        except Exception:
            return False
    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")

# === STEP 6: Generate QR Code ===
def generate_qr_code(url, output_path="assets/qr_public_key.png"):
    qr = qrcode.QRCode(version=1, box_size=4, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img_qr = qr.make_image(fill="black", back_color="white").convert("RGBA")
    img_qr.save(output_path)
    print(f"\n🔗 QR code linking to public key registry saved at: {output_path}")

# === MAIN EXECUTION ===
def main():
    try:
        stamped_path = find_stamped_image()
        print(f"🔍 Verifying: {stamped_path}")

        metadata = extract_metadata(stamped_path)
        print("\n📦 Extracted Metadata:\n", metadata)

        fields = parse_metadata(metadata)
        digest = hash_file(stamped_path)

        valid = verify_signature(
            digest,
            fields.get("Signature"),
            fields.get("PublicKey"),
            fields.get("Algorithm")
        )

        if valid:
            print("\n✅ Signature is VALID. Image is authentic.")
        else:
            print("\n❌ Signature is INVALID.")

        generate_qr_code(PUBLIC_KEY_URL)

    except Exception as e:
        print(f"\n❌ Verification failed: {e}")

if __name__ == "__main__":
    main()
