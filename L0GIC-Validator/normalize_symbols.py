#!/usr/bin/env python3
"""
Run: python normalize_symbols.py
Scans symbol_map.json for UID, char, and alias collisions
Suggests fixes and optionally writes a cleaned version
"""

import json
import os
from collections import defaultdict, Counter

# === Config ===
IN = "symbol_map.json"
OUT = "symbol_map_cleaned.json"
REPORT = "audit_reports/normalization_report.json"
os.makedirs("audit_reports", exist_ok=True)

# === Load Symbol Map ===
with open(IN, "r", encoding="utf-8") as f:
    data = json.load(f)

symbols = data.get("map", {})
print(f"Loaded {len(symbols)} symbols from {IN}")

# === Track Collisions ===
uid_map = defaultdict(list)
char_map = defaultdict(list)
alias_map = defaultdict(list)

for key, entry in symbols.items():
    uid = entry.get("uid", "")
    char = entry.get("char", "")
    aliases = entry.get("aliases", [])

    if uid: uid_map[uid].append(key)
    if char: char_map[char].append(key)
    for alias in aliases:
        alias_map[alias].append(key)

# === Detect Duplicates ===
def find_duplicates(dmap):
    return {k: v for k, v in dmap.items() if len(v) > 1}

uid_dupes = find_duplicates(uid_map)
char_dupes = find_duplicates(char_map)
alias_dupes = find_duplicates(alias_map)

# === Suggest Fixes ===
fixes = {}
for uid, keys in uid_dupes.items():
    for i, key in enumerate(keys[1:], start=2):
        fixes[key] = {"uid": f"{uid}_v{i}"}

for char, keys in char_dupes.items():
    for i, key in enumerate(keys[1:], start=2):
        fixes.setdefault(key, {})["char"] = f"{char}#{i}"

for alias, keys in alias_dupes.items():
    for i, key in enumerate(keys[1:], start=2):
        fixes.setdefault(key, {})["aliases"] = [f"{alias}_v{i}"]

# === Apply Fixes (Optional)
cleaned = {}
for key, entry in symbols.items():
    fixed = fixes.get(key)
    if fixed:
        entry = entry.copy()
        if "uid" in fixed: entry["uid"] = fixed["uid"]
        if "char" in fixed: entry["char"] = fixed["char"]
        if "aliases" in fixed:
            entry["aliases"] = [a if a not in fixed["aliases"] else f"{a}_v2" for a in entry.get("aliases", [])]
    cleaned[key] = entry

# === Output Cleaned Map and Report
with open(OUT, "w", encoding="utf-8") as f:
    json.dump({**data, "map": cleaned}, f, indent=2, ensure_ascii=False)

with open(REPORT, "w", encoding="utf-8") as f:
    json.dump({
        "uid_conflicts": uid_dupes,
        "char_conflicts": char_dupes,
        "alias_conflicts": alias_dupes,
        "fixes_applied": fixes
    }, f, indent=2, ensure_ascii=False)

print(f"\n✅ Normalization complete. Cleaned map written to {OUT}")
print(f"📄 Report written to {REPORT}")
