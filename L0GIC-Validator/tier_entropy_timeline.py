import json
import matplotlib.pyplot as plt
from collections import defaultdict

MAP_PATH = "symbol_map_deduped.json"

with open(MAP_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)["map"]

tier_entropy = defaultdict(list)
for sym in data.values():
    tier = sym.get("tier", "Unknown")
    entropy = sym.get("entropy")
    if entropy is not None:
        tier_entropy[tier].append(entropy)

tiers = sorted(tier_entropy.keys())
avg_entropy = [sum(vals)/len(vals) for vals in [tier_entropy[t] for t in tiers]]

plt.figure(figsize=(10, 5))
plt.plot(tiers, avg_entropy, marker="o", color="mediumvioletred")
plt.title("Tier Evolution Timeline")
plt.xlabel("Tier")
plt.ylabel("Average Entropy")
plt.grid(True)
plt.tight_layout()
plt.savefig("assets/tier_entropy_timeline.png")
print("✅ Saved tier evolution timeline to assets/tier_entropy_timeline.png")
