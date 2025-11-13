#!/usr/bin/env python3
"""
Run: python glyph_entropy.py
Calculates symbolic entropy scores for each entry in symbol_map.json
Outputs reports in ./audit_reports/
"""

import json
import os
import sys
import csv
import matplotlib.pyplot as plt

# === Config ===
IN = "symbol_map.json"
OUT_DIR = "audit_reports"
os.makedirs(OUT_DIR, exist_ok=True)

# === Helpers ===
def classify_entropy(score):
    if score >= 18: return "High"
    elif score >= 10: return "Medium"
    else: return "Low"


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json(obj, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2, sort_keys=True)

def write_csv(rows, headers, path):
    with open(path, "w", newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

# === Entropy Scoring Logic ===
def compute_entropy(entry):
    uid = entry.get("uid", "")
    tags = entry.get("tags", [])
    char = entry.get("char", "")
    aliases = entry.get("aliases", [])

    score = 0
    score += len(uid) * 0.5                # UID length contributes
    score += len(tags) * 2.0               # More tags = more meaning
    score += len(aliases) * 1.5            # Aliases add semantic weight
    score += 5.0 if char else 0            # Emoji presence boosts score
    return round(score, 2)

# === Load Symbol Map ===
try:
    data = load_json(IN)
except Exception as e:
    print("Failed to load JSON:", e)
    sys.exit(1)

symbols = data.get("map", {})
print(f"Loaded {len(symbols)} entries from {IN}")

# === Compute Entropy Scores and Tag Counts ===
entropy_scores = []
entropy_vs_tags = []

for key, entry in symbols.items():
    score = compute_entropy(entry)
    n_tags = len(entry.get("tags", []))
    entropy_scores.append({"key": key, "entropy": score})
    entropy_vs_tags.append({"key": key, "entropy": score, "n_tags": n_tags})

# === Output Reports ===
write_json({"entropy_scores": entropy_scores}, os.path.join(OUT_DIR, "entropy_scores.json"))
write_csv(entropy_scores, ["key", "entropy"], os.path.join(OUT_DIR, "entropy_scores.csv"))
write_csv(entropy_vs_tags, ["key", "entropy", "n_tags"], os.path.join(OUT_DIR, "entropy_vs_tags.csv"))

# === Print Summary ===
top_entropy = sorted(entropy_scores, key=lambda x: x["entropy"], reverse=True)[:10]
print("Top 10 symbols by entropy:")
for e in top_entropy:
    print(f"  {e['key']}: {e['entropy']}")

# === Plot Entropy vs. Tag Count ===
x = [e["n_tags"] for e in entropy_vs_tags]
y = [e["entropy"] for e in entropy_vs_tags]

plt.scatter(x, y, alpha=0.6)
plt.xlabel("Tag Count")
plt.ylabel("Entropy Score")
plt.title("Entropy vs. Tag Count")
plt.grid(True)
plt.savefig(os.path.join(OUT_DIR, "entropy_vs_tags_plot.png"))
plt.show()
