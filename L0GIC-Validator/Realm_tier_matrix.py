# realm_tier_matrix.py
import json
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

with open("symbol_map_deduped.json", "r", encoding="utf-8") as f:
    data = json.load(f)["map"]

df = pd.DataFrame([
    {"realm": s.get("realm", "Unknown"), "tier": s.get("tier", "Unknown")}
    for s in data.values()
])

pivot = df.pivot_table(index="realm", columns="tier", aggfunc=len, fill_value=0)
plt.figure(figsize=(10, 6))
sns.heatmap(pivot, annot=True, cmap="YlGnBu", fmt="d")
plt.title("Realm-Tier Symbol Density")
plt.tight_layout()
plt.savefig("realm_tier_matrix.png")
print("✅ Saved realm-tier matrix to realm_tier_matrix.png")
