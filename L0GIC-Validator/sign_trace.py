import oqs

# --- Supported PQC Algorithms ---
SUPPORTED_ALGORITHMS = ["Dilithium2", "Dilithium3", "Dilithium5"]

# --- Sign Trace ---
def sign_trace_with_dilithium(message: bytes, algorithm: str = "Dilithium2") -> dict:
    """
    Signs a message using a Dilithium algorithm via pyoqs.

    Args:
        message (bytes): The message to sign.
        algorithm (str): One of Dilithium2, Dilithium3, Dilithium5.

    Returns:
        dict: {
            "algorithm": <str>,
            "signature": <hex str>,
            "public_key": <hex str>
        }
    """
    if algorithm not in SUPPORTED_ALGORITHMS:
        raise ValueError(f"Unsupported algorithm '{algorithm}'. Choose from {SUPPORTED_ALGORITHMS}.")

    if algorithm not in oqs.Signature.algorithms:
        raise RuntimeError(f"'{algorithm}' not available in your liboqs build.")

    with oqs.Signature(algorithm) as signer:
        public_key = signer.generate_keypair()
        signature = signer.sign(message)
        return {
            "algorithm": algorithm,
            "signature": signature.hex(),
            "public_key": public_key.hex()
        }

# --- Verify Trace ---
def verify_trace_with_dilithium(message: bytes, signature_hex: str, public_key_hex: str, algorithm: str = "Dilithium2") -> bool:
    """
    Verifies a Dilithium signature.

    Args:
        message (bytes): Original message.
        signature_hex (str): Signature in hex.
        public_key_hex (str): Public key in hex.
        algorithm (str): Dilithium variant.

    Returns:
        bool: True if valid, False otherwise.
    """
    if algorithm not in SUPPORTED_ALGORITHMS:
        raise ValueError(f"Unsupported algorithm '{algorithm}'.")

    if algorithm not in oqs.Signature.algorithms:
        raise RuntimeError(f"'{algorithm}' not available in your liboqs build.")

    signature = bytes.fromhex(signature_hex)
    public_key = bytes.fromhex(public_key_hex)

    with oqs.Signature(algorithm) as verifier:
        return verifier.verify(message, signature, public_key)

# --- CLI Test Stub ---
if __name__ == "__main__":
    msg = b"validate this snapshot hash"
    result = sign_trace_with_dilithium(msg, "Dilithium2")

    print("🔐 Algorithm:", result["algorithm"])
    print("📜 Signature:", result["signature"])
    print("🔑 Public Key:", result["public_key"])

    valid = verify_trace_with_dilithium(msg, result["signature"], result["public_key"], result["algorithm"])
    print("✅ Signature Valid:", valid)
