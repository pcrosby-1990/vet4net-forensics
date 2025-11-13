import json
import os
from datetime import datetime

REGISTRY_PATH = "assets/registry.json"

def load_registry():
    if not os.path.exists(REGISTRY_PATH):
        return []
    with open(REGISTRY_PATH, "r") as f:
        return json.load(f)

def save_registry_entry(entry: dict):
    registry = load_registry()
    registry.append(entry)
    with open(REGISTRY_PATH, "w") as f:
        json.dump(registry, f, indent=4)
    print(f"✅ Registry entry saved for trace ID: {entry['trace_id']}")

def create_registry_entry(trace_id: str, digest: bytes, signature: str, public_key: str, algorithm: str) -> dict:
    return {
        "trace_id": trace_id,
        "digest": digest.hex(),
        "signature": signature,
        "public_key": public_key,
        "algorithm": algorithm,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
