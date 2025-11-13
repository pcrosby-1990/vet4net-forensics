from nacl.signing import VerifyKey
import hashlib

# Load public key
public_key_hex = "74191d893db82be9955ed5fb95fe2d8f69d35395"
verify_key = VerifyKey(bytes.fromhex(public_key_hex))

# Load image and extract hash
def hash_file(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

image_path = "assets/stamped/stamped_yourfile.png"
hash = hash_file(image_path)

# Paste the signature from metadata
signature_hex = "paste_signature_here"
signature_bytes = bytes.fromhex(signature_hex)

# Verify
try:
    verify_key.verify(hash.encode(), signature_bytes)
    print("✅ Signature is valid. Image is authentic.")
except:
    print("❌ Signature is invalid or image was tampered.")
