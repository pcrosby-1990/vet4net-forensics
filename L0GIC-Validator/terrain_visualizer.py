# === terrain_visualizer.py ===

import json
from datetime import datetime
import matplotlib.pyplot as plt

# Set emoji-friendly font (optional)
plt.rcParams['font.family'] = 'Segoe UI Emoji'

def plot_resonance(path: str = "terrain_archive.jsonl", mode: str = "hybrid"):
    """
    Visualizes resonance levels over time with optional glyph annotations.
    """
    timestamps = []
    resonance_levels = []
    entropy_levels = []
    glyph_labels = []

    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    entry = json.loads(line)
                    ts = entry.get("timestamp")
                    rl = entry.get("resonance")  # Corrected field name
                    el = entry.get("entropy_level", 0.42)
                    glyphs = entry.get("glyphs_activated", [])

                    if ts and rl is not None:
                        try:
                            timestamps.append(datetime.fromisoformat(ts))
                            resonance_levels.append(rl)
                            entropy_levels.append(el)
                            glyph_labels.append(", ".join(glyphs))
                        except ValueError:
                            continue  # Skip malformed timestamps
                except json.JSONDecodeError:
                    continue
    except FileNotFoundError:
        print(f"⚠️ Archive not found at {path}")
        return

    if not timestamps:
        print("⚠️ No valid resonance data found.")
        return

    # Sort by time
    combined = sorted(zip(timestamps, resonance_levels, entropy_levels, glyph_labels))
    timestamps, resonance_levels, entropy_levels, glyph_labels = zip(*combined)

    # Normalize entropy for color mapping
    colors = [plt.cm.plasma(min(1.0, max(0.0, e))) for e in entropy_levels]

    # Plot
    plt.figure(figsize=(14, 6))
    if mode == "line":
        plt.plot(timestamps, resonance_levels, color="purple", linewidth=2)
    elif mode == "scatter":
        plt.scatter(timestamps, resonance_levels, c=colors, s=60)
    else:  # hybrid
        plt.plot(timestamps, resonance_levels, color="purple", alpha=0.6)
        plt.scatter(timestamps, resonance_levels, c=colors, s=60)

    # Annotate glyphs
    for i, label in enumerate(glyph_labels):
        if label:
            plt.annotate(label, (timestamps[i], resonance_levels[i]),
                         fontsize=8, alpha=0.7, rotation=30)

    plt.title("🌐 Terrain Resonance with Glyph Overlay")
    plt.xlabel("Timestamp")
    plt.ylabel("Resonance Level")
    plt.xticks(rotation=45)
    plt.grid(True, linestyle="--", alpha=0.3)
    plt.tight_layout()
    plt.show()
