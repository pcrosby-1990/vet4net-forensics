# test_signature.py
from nacl.signing import SigningKey
import hashlib

private_key_hex = "your_private_key_here"
signing_key = SigningKey(bytes.fromhex(private_key_hex))

def hash_file(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

image_path = "assets/to_stamp/test_image.png"
image_hash = hash_file(image_path)
signature = signing_key.sign(image_hash.encode()).signature.hex()

print("Image Hash:", image_hash)
print("Signature:", signature)
