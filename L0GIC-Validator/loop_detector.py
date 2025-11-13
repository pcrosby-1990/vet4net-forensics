# === loop_detector.py ===

import json
from typing import List, Dict
from datetime import datetime

# === Load Terrain Archive ===
def load_archive(path: str = "terrain_archive.jsonl") -> List[Dict]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return [json.loads(line) for line in f if line.strip()]
    except Exception as e:
        print(f"⚠️ Failed to load archive: {e}")
        return []

# === Detect Recursion Depth ===
def detect_recursion_depth(emotion: str, window_seconds: int = 120) -> int:
    now = datetime.utcnow()
    archive = load_archive()

    recent = [
        entry for entry in archive
        if entry.get("emotion") == emotion and
           "timestamp" in entry and
           (now - datetime.fromisoformat(entry["timestamp"])).total_seconds() <= window_seconds
    ]

    return len(recent)
