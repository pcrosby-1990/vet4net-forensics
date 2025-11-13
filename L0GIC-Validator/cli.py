import argparse
import hashlib
from sign_trace import sign_trace_with_dilithium
from hmac_trace import sign_trace_with_hmac  # Optional fallback module

def run_cli():
    parser = argparse.ArgumentParser(description="L0GIC Validator CLI")
    parser.add_argument("--trace-id", required=True, help="Unique trace identifier")
    parser.add_argument("--message", required=True, help="Message to sign")
    parser.add_argument("--algorithm", choices=["Dilithium2", "Dilithium3", "Dilithium5", "HMAC"], default="Dilithium2", help="Signature algorithm")
    args = parser.parse_args()

    # Convert message to bytes and digest it
    message_bytes = args.message.encode("utf-8")
    digest = hashlib.sha256(message_bytes).digest()

    # Sign using selected algorithm
    if args.algorithm == "HMAC":
        result = sign_trace_with_hmac(digest)
    else:
        result = sign_trace_with_dilithium(digest, args.algorithm)

    # Output registry-style trace metadata
    print("\n🧾 Trace Metadata")
    print(f"🆔 Trace ID: {args.trace_id}")
    print(f"🔣 Digest (SHA-256): {digest.hex()}")
    print(f"🔐 Algorithm: {result['algorithm']}")
    print(f"📜 Signature: {result['signature']}")
    print(f"🔑 Public Key: {result['public_key']}")
