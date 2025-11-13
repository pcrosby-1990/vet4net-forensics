# === fragment_archive.py ===

import json
from fragment_tier import compute_tier, load_tier_map

ARCHIVE_PATH = "terrain_archive.jsonl"

def write_fragment(fragment: dict, tier_map: dict = None, path: str = ARCHIVE_PATH):
    """
    Computes tier and appends fragment to archive.
    """
    if "tier" not in fragment:
        if not tier_map:
            tier_map = load_tier_map()
        fragment["tier"] = compute_tier(fragment, tier_map)

    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(fragment) + "\n")

def load_fragments(path: str = ARCHIVE_PATH) -> list:
    """
    Loads all fragments from archive.
    """
    fragments = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    fragments.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    except FileNotFoundError:
        print(f"⚠️ Archive not found at {path}")
    return fragments
