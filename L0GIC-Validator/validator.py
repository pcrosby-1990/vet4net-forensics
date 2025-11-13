#!/usr/bin/env python3
"""
Validator Plus - Quantum-Resistant Upgrade (Dilithium hybrid signatures)

Notes:
- This script upgrades the original HMAC-based validator to use a hybrid
  signature scheme: an Ed25519 signature (fast, classical) combined with
  a Dilithium signature (post-quantum). Verifiers must check BOTH signatures
  to consider the payload fully valid.
- Dilithium signing/verification uses the Open Quantum Safe Python bindings (pyoqs).
  Install: pip install pyoqs
- Ed25519 uses the cryptography package. Install: pip install cryptography
- For production, store private keys in HSMs or hardware modules and perform
  signing operations there. This script contains example software signing only.
- The tool also includes deterministic JSON canonicalization for digesting.
"""

import argparse
import os
import json
import datetime
import csv
import hashlib
import base64
from typing import Tuple, Dict

# Try to import pyoqs and cryptography. If unavailable, throw a clear error.
try:
    import oqs
except Exception as e:
    oqs = None

try:
    from cryptography.hazmat.primitives.asymmetric.ed25519 import (
        Ed25519PrivateKey,
        Ed25519PublicKey,
    )
    from cryptography.hazmat.primitives import serialization
    from cryptography.exceptions import InvalidSignature
except Exception as e:
    Ed25519PrivateKey = None

# --- Utility: Deterministic JSON canonicalization ---
def canonicalize_json(obj: dict) -> bytes:
    """
    Canonicalize the JSON object deterministically:
    - Sort object keys at all nesting levels
    - Use separators without extra spaces
    - Ensure consistent UTF-8 encoding (no ensure_ascii -> preserve codepoints)
    This is compatible with common canonicalization approaches for signature use.
    (If you need strict RFC-conformance to a specific spec, replace this
    with an allowed canonicalization library.)
    """
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


# --- Registry I/O ---
def load_registry(path: str) -> dict:
    return json.load(open(path)) if os.path.exists(path) else {}


def save_registry(registry: dict, path: str) -> None:
    json.dump(registry, open(path, "w"), indent=2)


# --- Hashing Utilities ---
def hash_file(path: str, algorithm: str = "blake3") -> str:
    # Keep previous blake3 behavior if installed; otherwise fallback to sha256.
    try:
        if algorithm == "blake3":
            import blake3

            with open(path, "rb") as f:
                return blake3.blake3(f.read()).hexdigest()
    except Exception:
        # fallthrough to sha256 if blake3 is unavailable
        pass
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def hash_snapshot_metadata(name: str, link: str, system: str, timestamp: str, algorithm: str = "sha256") -> str:
    combined = f"{name}|{link}|{system}|{timestamp}"
    if algorithm == "sha256":
        return hashlib.sha256(combined.encode("utf-8")).hexdigest()
    else:
        # fallback: blake3 if requested and available
        try:
            import blake3

            return blake3.blake3(combined.encode("utf-8")).hexdigest()
        except Exception:
            return hashlib.sha256(combined.encode("utf-8")).hexdigest()


# --- Signature Utilities (Hybrid: Ed25519 + Dilithium) ---
# Note: In production, prefer HSM-backed signing. This code demonstrates software signing.

def generate_ed25519_keypair() -> Tuple[bytes, bytes]:
    """
    Generate an Ed25519 keypair. Returns (private_bytes, public_bytes) in raw form.
    """
    if Ed25519PrivateKey is None:
        raise RuntimeError("cryptography Ed25519 support is required (pip install cryptography)")
    priv = Ed25519PrivateKey.generate()
    pub = priv.public_key()
    priv_bytes = priv.private_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PrivateFormat.Raw,
        encryption_algorithm=serialization.NoEncryption(),
    )
    pub_bytes = pub.public_bytes(encoding=serialization.Encoding.Raw, format=serialization.PublicFormat.Raw)
    return priv_bytes, pub_bytes


def ed25519_sign(private_raw: bytes, message: bytes) -> bytes:
    if Ed25519PrivateKey is None:
        raise RuntimeError("cryptography Ed25519 support is required (pip install cryptography)")
    priv = Ed25519PrivateKey.from_private_bytes(private_raw)
    return priv.sign(message)


def ed25519_verify(public_raw: bytes, message: bytes, signature: bytes) -> bool:
    if Ed25519PublicKey is None:
        raise RuntimeError("cryptography Ed25519 support is required (pip install cryptography)")
    pub = Ed25519PublicKey.from_public_bytes(public_raw)
    try:
        pub.verify(signature, message)
        return True
    except InvalidSignature:
        return False


def generate_dilithium_keypair(algorithm: str = "Dilithium2") -> Tuple[bytes, bytes]:
    """
    Generate a Dilithium keypair using pyoqs (oqs). Returns (private_bytes, public_bytes).
    algorithm choices: "Dilithium2", "Dilithium3", "Dilithium5" depending on pyoqs support.
    """
    if oqs is None:
        raise RuntimeError("pyoqs is required for Dilithium support (pip install pyoqs)")
    with oqs.Signature(algorithm) as signer:
        pub = signer.generate_keypair()
        priv = signer.export_secret_key()
        # signer.generate_keypair() returns public; to get private we export from signer after generation.
        # pyoqs' API: instantiate signer and call generate_keypair() gives public; the signer's secret is internal.
        # To keep it simple and compatible, we regenerate a signer and export keys via provided methods.
    # For compatibility with installed pyoqs versions, use the API like below (works in pyOQS >= 0.10):
    # NOTE: Some pyoqs versions return (public, secret) directly from generate_keypair()
    try:
        with oqs.Signature(algorithm) as s:
            pub, priv = s.generate_keypair()
            return priv, pub
    except Exception:
        # older/newer pyoqs variations:
        with oqs.Signature(algorithm) as s:
            pub = s.generate_keypair()
            priv = s.export_secret_key()
            return priv, pub


def dilithium_sign(private_raw: bytes, message: bytes, algorithm: str = "Dilithium2") -> bytes:
    if oqs is None:
        raise RuntimeError("pyoqs is required for Dilithium support (pip install pyoqs)")
    with oqs.Signature(algorithm) as s:
        s.import_secret_key(private_raw)
        sig = s.sign(message)
    return sig


def dilithium_verify(public_raw: bytes, message: bytes, signature: bytes, algorithm: str = "Dilithium2") -> bool:
    if oqs is None:
        raise RuntimeError("pyoqs is required for Dilithium support (pip install pyoqs)")
    with oqs.Signature(algorithm) as s:
        s.import_public_key(public_raw)
        try:
            return s.verify(message, signature)
        except Exception:
            return False


# --- Helper: base64 encode/decode for storing binary keys and signatures ---
def b64(x: bytes) -> str:
    return base64.b64encode(x).decode("ascii")


def ub64(s: str) -> bytes:
    return base64.b64decode(s.encode("ascii"))


# --- High-level hybrid sign/verify flows ---
def hybrid_sign(canonical_bytes: bytes, ed_priv_raw: bytes, dilithium_priv_raw: bytes, dilithium_alg: str = "Dilithium2") -> Dict:
    """
    Signs canonical_bytes with both Ed25519 and Dilithium. Returns a dictionary containing:
      - ed25519 signature (base64)
      - dilithium signature (base64)
      - ed25519 public (base64)
      - dilithium public (base64)
      - algorithms used
      - sig_time
    """
    ed_sig = ed25519_sign(ed_priv_raw, canonical_bytes)
    dil_sig = dilithium_sign(dilithium_priv_raw, canonical_bytes, dilithium_alg)

    # Extract public keys:
    ed_pub_raw = Ed25519PrivateKey.from_private_bytes(ed_priv_raw).public_key().public_bytes(
        encoding=serialization.Encoding.Raw, format=serialization.PublicFormat.Raw
    )
    # For Dilithium, public key retrieval depends on pyoqs API: export_public_key() or return from key generation.
    # We assume the caller saved both public keys at key generation time and passes them into registry if needed.
    # However for convenience, some pyoqs versions allow importing priv to get pub; to keep simple, store pub separately.

    return {
        "ed25519": {
            "sig": b64(ed_sig),
            "pub": b64(ed_pub_raw),
            "alg": "ed25519"
        },
        "dilithium": {
            "sig": b64(dil_sig),
            "pub": None,  # fill with base64 public key when available / provided
            "alg": dilithium_alg
        },
        "sig_time": datetime.datetime.utcnow().isoformat() + "Z"
    }


def hybrid_verify(canonical_bytes: bytes, hybrid_block: dict) -> bool:
    """
    Verifies both signatures recorded in hybrid_block. Returns True only if both verify.
    hybrid_block must contain:
      - ed25519.pub (base64), ed25519.sig (base64)
      - dilithium.pub (base64), dilithium.sig (base64), dilithium.alg
    """
    try:
        ed_pub = ub64(hybrid_block["ed25519"]["pub"])
        ed_sig = ub64(hybrid_block["ed25519"]["sig"])
        dil_pub_b64 = hybrid_block["dilithium"].get("pub")
        dil_sig = ub64(hybrid_block["dilithium"]["sig"])
        dil_alg = hybrid_block["dilithium"].get("alg", "Dilithium2")
    except Exception:
        return False

    ok_ed = ed25519_verify(ed_pub, canonical_bytes, ed_sig)

    if dil_pub_b64 is None:
        # cannot verify if dilithium public key missing
        ok_dil = False
    else:
        dil_pub = ub64(dil_pub_b64)
        ok_dil = dilithium_verify(dil_pub, canonical_bytes, dil_sig, dil_alg)

    return ok_ed and ok_dil


# --- CLI Entry (main) ---
def main():
    parser = argparse.ArgumentParser(description="Validator Plus CLI - Hybrid Ed25519 + Dilithium (post-quantum)")
    parser.add_argument("--file", help="Path to file to process")
    parser.add_argument("--name", help="Snapshot name")
    parser.add_argument("--link", help="Snapshot link")
    parser.add_argument("--system", help="Snapshot system ID")
    parser.add_argument("--timestamp", help="Snapshot timestamp (ISO format)")
    parser.add_argument("--generate-keys", action="store_true", help="Generate new keypair for Ed25519 and Dilithium (software demo only)")
    parser.add_argument("--ed-priv", help="Path to Ed25519 private key (raw bytes base64)")
    parser.add_argument("--ed-pub", help="Path to Ed25519 public key (raw bytes base64)")
    parser.add_argument("--dil-priv", help="Path to Dilithium private key (base64)")
    parser.add_argument("--dil-pub", help="Path to Dilithium public key (base64)")
    parser.add_argument("--dil-alg", default="Dilithium2", help="Dilithium algorithm variant: Dilithium2|Dilithium3|Dilithium5")
    parser.add_argument("--sign", action="store_true", help="Sign the payload with provided keys (software demo only).")
    parser.add_argument("--verify", action="store_true", help="Verify signatures on a registry label.")
    parser.add_argument("--verify-from-registry", help="Label to verify using registry metadata")
    parser.add_argument("--batch", help="Folder of files to process")
    parser.add_argument("--csv", help="CSV of snapshot metadata")
    parser.add_argument("--export", help="Path to export results as CSV")
    parser.add_argument("--registry", default="registry.json", help="Registry file path")
    args = parser.parse_args()

    registry = load_registry(args.registry)

    # --- Key generation for demo/testing only ---
    if args.generate_keys:
        if Ed25519PrivateKey is None or oqs is None:
            print("❌ Required libraries missing: pip install cryptography pyoqs")
            return
        # Ed25519
        ed_priv_raw, ed_pub_raw = generate_ed25519_keypair()
        # Dilithium
        try:
            dil_priv_raw, dil_pub_raw = generate_dilithium_keypair(args.dil_alg)
        except Exception as e:
            print(f"❌ Failed to generate Dilithium keypair: {e}")
            return
        print("🔐 Generated keys (base64). Store private keys securely (HSM recommended).")
        print(f"Ed25519 Private (base64): {b64(ed_priv_raw)}")
        print(f"Ed25519 Public  (base64): {b64(ed_pub_raw)}")
        print(f"Dilithium Private (base64): {b64(dil_priv_raw)}")
        print(f"Dilithium Public  (base64): {b64(dil_pub_raw)}")
        return

    # --- Verify from Registry ---
    if args.verify_from_registry and args.verify:
        label = args.verify_from_registry
        entry = registry.get(label)
        if not entry:
            print(f"❌ Entry '{label}' not found in registry.")
            return
        # Build canonical payload: remove proof fields before canonicalization
        payload = dict(entry)
        for k in ["content_digest", "proofs", "signed_by", "anchor", "mutability_controls"]:
            if k in payload:
                del payload[k]
        canonical_bytes = canonicalize_json(payload)
        computed_digest = hashlib.sha256(canonical_bytes).hexdigest()
        digest_match = computed_digest == entry.get("content_digest", {}).get("hex")
        proofs = entry.get("proofs")
        verified = hybrid_verify(canonical_bytes, proofs) if proofs else False

        print(f"\n✅ Label: {label}")
        print(f"🔑 Canonical SHA-256: {computed_digest}")
        print(f"🕒 Timestamp: {entry.get('timestamp', 'N/A')}")
        print(f"📁 Registry Match: {'✅ Yes' if digest_match else '❌ No'}")
        print(f"🔐 Hybrid Signature Valid (Ed25519 + Dilithium): {'✅ Yes' if verified else '❌ No'}")
        return

    # --- Batch File Processing ---
    if args.batch:
        results = []
        for fname in os.listdir(args.batch):
            fpath = os.path.join(args.batch, fname)
            if not os.path.isfile(fpath):
                continue
            hash_val = hash_file(fpath)
            timestamp = datetime.datetime.utcnow().isoformat() + "Z"
            # Build entry payload (canonicalizable)
            payload = {
                "id": fname,
                "hash": hash_val,
                "timestamp": timestamp,
            }
            canonical_bytes = canonicalize_json(payload)
            content_digest = {"algorithm": "sha256", "hex": hashlib.sha256(canonical_bytes).hexdigest()}

            proofs = None
            if args.sign:
                # Load keys (base64 files) - software demo only
                if not (args.ed_priv and args.dil_priv and args.dil_pub):
                    print("❌ To sign in batch, provide --ed-priv, --dil-priv, and --dil-pub (base64 files).")
                    return
                ed_priv_raw = ub64(open(args.ed_priv).read().strip())
                dil_priv_raw = ub64(open(args.dil_priv).read().strip())
                dil_pub_raw = ub64(open(args.dil_pub).read().strip())
                hybrid = hybrid_sign(canonical_bytes, ed_priv_raw, dil_priv_raw, args.dil_alg)
                hybrid["dilithium"]["pub"] = b64(dil_pub_raw)
                proofs = hybrid

            results.append({
                "filename": fname,
                "hash": hash_val,
                "content_digest": content_digest,
                "proofs": proofs,
                "timestamp": timestamp
            })

        if results and args.export:
            with open(args.export, "w", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=results[0].keys())
                writer.writeheader()
                writer.writerows(results)
            print(f"✅ Batch results exported to {args.export}")
        else:
            print("✅ Batch processing complete.")
        return

    # --- Snapshot CSV Processing ---
    if args.csv:
        results = []
        with open(args.csv, newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                timestamp = row.get("timestamp") or (datetime.datetime.utcnow().isoformat() + "Z")
                hash_val = hash_snapshot_metadata(row["name"], row["link"], row["system"], timestamp)
                payload = {
                    "name": row["name"],
                    "link": row["link"],
                    "system": row["system"],
                    "timestamp": timestamp
                }
                canonical_bytes = canonicalize_json(payload)
                content_digest = {"algorithm": "sha256", "hex": hashlib.sha256(canonical_bytes).hexdigest()}

                proofs = None
                if args.sign:
                    if not (args.ed_priv and args.dil_priv and args.dil_pub):
                        print("❌ To sign CSV entries, provide --ed-priv, --dil-priv, and --dil-pub (base64 files).")
                        return
                    ed_priv_raw = ub64(open(args.ed_priv).read().strip())
                    dil_priv_raw = ub64(open(args.dil_priv).read().strip())
                    dil_pub_raw = ub64(open(args.dil_pub).read().strip())
                    hybrid = hybrid_sign(canonical_bytes, ed_priv_raw, dil_priv_raw, args.dil_alg)
                    hybrid["dilithium"]["pub"] = b64(dil_pub_raw)
                    proofs = hybrid

                results.append({
                    "name": row["name"],
                    "link": row["link"],
                    "system": row["system"],
                    "timestamp": timestamp,
                    "hash": hash_val,
                    "content_digest": content_digest,
                    "proofs": proofs
                })
        if results and args.export:
            with open(args.export, "w", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=results[0].keys())
                writer.writeheader()
                writer.writerows(results)
            print(f"✅ Snapshot results exported to {args.export}")
        else:
            print("✅ CSV processing complete.")
        return

    # --- Default Mode: File or Snapshot (single entry) ---
    timestamp = args.timestamp or (datetime.datetime.utcnow().isoformat() + "Z")

    if args.file:
        filename = os.path.basename(args.file)
        file_hash = hash_file(args.file)
        label = filename
        payload = {
            "id": label,
            "hash": file_hash,
            "timestamp": timestamp,
        }
    elif all([args.name, args.link, args.system]):
        label = args.name
        payload = {
            "name": args.name,
            "link": args.link,
            "system": args.system,
            "timestamp": timestamp
        }
    else:
        print("❌ Missing required input. Provide either --file or snapshot metadata (--name, --link, --system).")
        return

    canonical_bytes = canonicalize_json(payload)
    content_digest = {"algorithm": "sha256", "hex": hashlib.sha256(canonical_bytes).hexdigest()}

    print(f"\n✅ Label: {label}")
    print(f"🔑 Canonical SHA-256: {content_digest['hex']}")
    print(f"🕒 Timestamp: {timestamp}")

    proofs = None
    if args.sign:
        # Load private keys from provided files (base64). Software demo only.
        if not (args.ed_priv and args.dil_priv and args.dil_pub):
            print("❌ To sign, provide --ed-priv, --dil-priv, and --dil-pub (paths to base64-encoded key files).")
            return
        ed_priv_raw = ub64(open(args.ed_priv).read().strip())
        dil_priv_raw = ub64(open(args.dil_priv).read().strip())
        dil_pub_raw = ub64(open(args.dil_pub).read().strip())

        hybrid = hybrid_sign(canonical_bytes, ed_priv_raw, dil_priv_raw, args.dil_alg)
        hybrid["dilithium"]["pub"] = b64(dil_pub_raw)
        proofs = hybrid

        print("🔐 Signatures created (base64). Keep private keys secure; prefer HSMs for production.")
        print(f" - Ed25519 pub (base64): {hybrid['ed25519']['pub']}")
        print(f" - Dilithium pub (base64): {hybrid['dilithium']['pub']}")
        print(f" - Sig time: {hybrid['sig_time']}")

    # Build registry entry
    entry_data = dict(payload)
    entry_data["content_digest"] = content_digest
    entry_data["signature_policy"] = {
        "required_signatures": 2,
        "signers": ["ed25519:demo", f"dilithium:{args.dil_alg}"],
        "threshold": 2,
        "key_storage": "HSM recommended (software demo used)"
    }
    entry_data["proofs"] = proofs
    entry_data["mutability_controls"] = {
        "write_protected": True,
        "immutable_store": "wORM://organization/secure-store/CORE_0001_v1",
        "audit_log": "https://logs.example.org/append-only/validator_plus",
        "last_audit": datetime.datetime.utcnow().isoformat() + "Z"
    }

    # Save to registry
    registry[label] = entry_data
    save_registry(registry, args.registry)
    print(f"🗄️  Entry '{label}' saved to registry: {args.registry}")


if __name__ == "__main__":
    main()