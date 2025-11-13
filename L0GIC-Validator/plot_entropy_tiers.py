#!/usr/bin/env python3
"""
Run: python plot_entropy_tiers.py
Generates a bar chart of entropy tier distribution
"""

import pandas as pd
import matplotlib.pyplot as plt
import os

# === Config ===
IN = "audit_reports/entropy_tiers.csv"
OUT = "audit_reports/tier_distribution.png"
os.makedirs("audit_reports", exist_ok=True)

# === Load Data ===
df = pd.read_csv(IN)
tier_counts = df["tier"].value_counts().reindex(["Low", "Medium", "High"], fill_value=0)

# === Plot ===
plt.figure(figsize=(6, 4))
colors = {"Low": "#66c2a5", "Medium": "#fc8d62", "High": "#8da0cb"}
bars = plt.bar(tier_counts.index, tier_counts.values, color=[colors[t] for t in tier_counts.index])
plt.title("Entropy Tier Distribution")
plt.xlabel("Entropy Tier")
plt.ylabel("Symbol Count")

# === Annotate Bars
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, height + 1, str(height), ha="center", va="bottom")

# === Save Plot
plt.tight_layout()
plt.savefig(OUT)
print(f"\n✅ Tier distribution plot saved to {OUT}")
