import hmac
import hashlib
import os

def sign_trace_with_hmac(message: bytes, key: bytes = None) -> dict:
    key = key or os.urandom(32)
    signature = hmac.new(key, message, hashlib.sha256).digest()
    return {
        "algorithm": "HMAC-SHA256",
        "signature": signature.hex(),
        "public_key": key.hex()  # Treat as shared secret
    }
