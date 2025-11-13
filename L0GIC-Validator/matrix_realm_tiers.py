#!/usr/bin/env python3
"""
Run: python matrix_realm_tiers.py
Generates a Realm × Tier matrix from entropy_tiers.csv and symbol_map_deduped.json
"""

import pandas as pd
import json
import os

# === Config ===
MAP_PATH = "symbol_map_deduped.json"
TIERS_PATH = "audit_reports/entropy_tiers.csv"
OUT_CSV = "audit_reports/realm_tier_matrix.csv"
OUT_PNG = "audit_reports/realm_tier_matrix.png"
os.makedirs("audit_reports", exist_ok=True)

# === Load Symbol Map ===
with open(MAP_PATH, "r", encoding="utf-8") as f:
    symbol_map = json.load(f)["map"]

realm_by_uid = {
    entry["uid"]: entry.get("realm", "UNSPECIFIED")
    for entry in symbol_map.values()
}

# === Load Tier Data ===
df = pd.read_csv(TIERS_PATH)
df["realm"] = df["key"].map(realm_by_uid)
df["realm"] = df["realm"].fillna("UNSPECIFIED")

# === Build Matrix
matrix = df.groupby(["realm", "tier"]).size().unstack(fill_value=0)
matrix = matrix[["Low", "Medium", "High"]]  # consistent column order

# === Save CSV
matrix.to_csv(OUT_CSV)
print(f"\n✅ Realm × Tier matrix saved to {OUT_CSV}")

# === Optional Plot
import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(10, len(matrix)*0.4))
sns.heatmap(matrix, annot=True, fmt="d", cmap="YlGnBu", linewidths=0.5)
plt.title("Realm × Entropy Tier Matrix")
plt.xlabel("Entropy Tier")
plt.ylabel("Realm")
plt.tight_layout()
plt.savefig(OUT_PNG)
print(f"📊 Heatmap saved to {OUT_PNG}")
