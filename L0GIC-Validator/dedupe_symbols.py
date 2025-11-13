#!/usr/bin/env python3
"""
Run: python dedupe_symbols.py
Cleans UID, alias, and emoji collisions in symbol_map_cleaned.json
"""

import json
import os
from collections import defaultdict, Counter

# === Config ===
IN = "symbol_map_cleaned.json"
OUT = "symbol_map_deduped.json"
REPORT = "audit_reports/duplicate_summary.json"
os.makedirs("audit_reports", exist_ok=True)

# === Load Symbol Map ===
with open(IN, "r", encoding="utf-8") as f:
    data = json.load(f)

symbols = data.get("map", {})
print(f"Loaded {len(symbols)} symbols from {IN}")

# === Trackers ===
uid_tracker = defaultdict(list)
alias_tracker = defaultdict(list)
char_tracker = defaultdict(list)

# === Index Symbols
for key, entry in symbols.items():
    uid_tracker[entry.get("uid", key)].append(key)
    for alias in entry.get("aliases", []):
        alias_tracker[alias].append(key)
    char = entry.get("char")
    if char:
        char_tracker[char].append(key)

# === Fix UID Conflicts
for uid, keys in uid_tracker.items():
    if len(keys) > 1:
        for i, key in enumerate(keys):
            if i == 0:
                continue
            symbols[key]["uid"] = f"{uid}_v{i+1}"

# === Fix Alias Collisions
for alias, keys in alias_tracker.items():
    if len(keys) > 1:
        for i, key in enumerate(keys):
            if i == 0:
                continue
            symbols[key]["aliases"] = [
                f"{alias}_v{i+1}" if a == alias else a
                for a in symbols[key].get("aliases", [])
            ]

# === Fix Emoji Reuse
for char, keys in char_tracker.items():
    if len(keys) > 1:
        for i, key in enumerate(keys):
            if i == 0:
                continue
            symbols[key]["char"] = f"{char}#{i+1}"

# === Write Cleaned Map
with open(OUT, "w", encoding="utf-8") as f:
    json.dump({**data, "map": symbols}, f, indent=2, ensure_ascii=False)

# === Write Summary Report
summary = {
    "uid_conflicts": {k: v for k, v in uid_tracker.items() if len(v) > 1},
    "alias_conflicts": {k: v for k, v in alias_tracker.items() if len(v) > 1},
    "emoji_conflicts": {k: v for k, v in char_tracker.items() if len(v) > 1},
}
with open(REPORT, "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)

print(f"\n✅ Deduplication complete. Cleaned map written to {OUT}")
print(f"📄 Conflict summary written to {REPORT}")
