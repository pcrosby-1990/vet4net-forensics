# === fragment_tier_visualizer.py ===

import json
from datetime import datetime
import matplotlib.pyplot as plt

def plot_fragment_tiers(path: str = "terrain_archive.jsonl"):
    """
    Visualizes symbolic tier evolution over time.
    Each fragment is plotted by timestamp (x-axis) and tier (y-axis),
    with entropy level mapped to color and recursion depth mapped to size.
    """
    timestamps = []
    tiers = []
    entropy_levels = []
    recursion_depths = []

    # Load and parse terrain archive
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    entry = json.loads(line)
                    ts = entry.get("timestamp")
                    tier = entry.get("tier")
                    entropy = entry.get("entropy_level", 0.42)
                    recursion = entry.get("recursion_depth", 0)

                    if ts and tier is not None:
                        timestamps.append(datetime.fromisoformat(ts))
                        tiers.append(tier)
                        entropy_levels.append(entropy)
                        recursion_depths.append(recursion)
                except (json.JSONDecodeError, ValueError):
                    continue
    except FileNotFoundError:
        print(f"⚠️ Archive not found at {path}")
        return

    if not timestamps:
        print("⚠️ No valid tier data found.")
        return

    # Sort chronologically
    combined = sorted(zip(timestamps, tiers, entropy_levels, recursion_depths))
    timestamps, tiers, entropy_levels, recursion_depths = zip(*combined)

    # Normalize entropy for color mapping (magma colormap)
    colors = [plt.cm.magma(min(1.0, max(0.0, e))) for e in entropy_levels]
    sizes = [40 + r * 10 for r in recursion_depths]

    # Plot symbolic tier evolution
    plt.figure(figsize=(14, 6))
    plt.scatter(
        timestamps,
        tiers,
        c=colors,
        s=sizes,
        alpha=0.8,
        edgecolors="black"
    )

    plt.title("🧬 Fragment Tier Evolution")
    plt.xlabel("Timestamp")
    plt.ylabel("Symbolic Tier (1–3)")
    plt.xticks(rotation=45)
    plt.yticks([1, 2, 3])
    plt.grid(True, linestyle="--", alpha=0.3)
    plt.tight_layout()
    plt.show()

# Optional: run directly
if __name__ == "__main__":
    plot_fragment_tiers()
