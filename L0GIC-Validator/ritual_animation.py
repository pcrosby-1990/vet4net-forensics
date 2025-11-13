#!/usr/bin/env python3
"""
ritual_animation.py

Create an animated GIF showing the progression of 'collapse_events' as a directed graph.
Usage:
  python ritual_animation.py               # runs with embedded sample events and shows/saves ritual_animation.gif
  python ritual_animation.py --events my_events.json --output out.gif --interval 1000
"""

import argparse
import json
import os
import sys

import matplotlib.pyplot as plt
import matplotlib.animation as animation
from matplotlib.animation import FFMpegWriter
import networkx as nx


def load_events_from_json(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        raise ValueError("Events JSON must be a list of event objects.")
    return data


def ensure_valid_event(e):
    return {
        "timestamp": str(e.get("timestamp", "")),
        "label": str(e.get("label", e.get("timestamp", ""))),
        "color": e.get("color", "tab:blue"),
    }


def main():
    parser = argparse.ArgumentParser(description="Animate validator ritual collapse events as a graph")
    parser.add_argument("--events", "-e", help="JSON file with collapse_events (list of {timestamp,label,color})")
    parser.add_argument("--output", "-o", default="ritual_animation.gif", help="Output GIF path")
    parser.add_argument("--interval", "-i", default=1000, type=int, help="Frame interval in ms (default 1000)")
    parser.add_argument("--show", action="store_true", help="Show the animation window after creation")
    args = parser.parse_args()

    if args.events:
        if not os.path.exists(args.events):
            print(f"Events file not found: {args.events}", file=sys.stderr)
            sys.exit(1)
        collapse_events = load_events_from_json(args.events)
    else:
        collapse_events = [
            {"timestamp": "2025-10-30T00:00:00Z", "label": "Init", "color": "tab:green"},
            {"timestamp": "2025-10-30T00:00:30Z", "label": "Quark detected", "color": "tab:orange"},
            {"timestamp": "2025-10-30T00:01:00Z", "label": "Passive scan", "color": "tab:gray"},
            {"timestamp": "2025-10-30T00:02:00Z", "label": "Tau override", "color": "tab:red"},
            {"timestamp": "2025-10-30T00:03:00Z", "label": "Splash", "color": "tab:purple"},
        ]

    collapse_events = [ensure_valid_event(e) for e in collapse_events]
    if not collapse_events:
        print("No events to animate.", file=sys.stderr)
        sys.exit(1)

    fig, ax = plt.subplots(figsize=(10, 6))
    G = nx.DiGraph()

    def update(frame):
        ax.clear()
        event = collapse_events[frame]
        ts = event["timestamp"]
        label = event["label"]
        color = event["color"]

        if ts not in G:
            G.add_node(ts, label=label, color=color)

        if frame > 0:
            prev_ts = collapse_events[frame - 1]["timestamp"]
            if not G.has_edge(prev_ts, ts):
                G.add_edge(prev_ts, ts)

        pos = nx.spring_layout(G, seed=42)
        node_colors = [G.nodes[n].get("color", "tab:blue") for n in G.nodes()]
        labels = nx.get_node_attributes(G, "label")

        nx.draw_networkx_edges(G, pos, ax=ax, edge_color="gray", arrows=True, arrowstyle="-|>", arrowsize=12)
        nx.draw_networkx_nodes(G, pos, ax=ax, node_color=node_colors, node_size=1200, linewidths=1, edgecolors="k")
        nx.draw_networkx_labels(G, pos, labels, font_size=9, font_color="white")

        ax.set_title(f"Validator Ritual Collapse Progression — {ts}")
        ax.axis("off")

    frames = len(collapse_events)
    ani = animation.FuncAnimation(fig, update, frames=frames, interval=args.interval, repeat=False)

    try:
        fps = max(1, int(1000 / args.interval))
    except Exception:
        fps = 1

    print(f"Saving animation to {args.output} ...")
    ani.save(args.output, writer="pillow", fps=fps)

    mp4_output = args.output.replace(".gif", ".mp4")
    writer = FFMpegWriter(fps=fps)
    ani.save(mp4_output, writer=writer)
    print(f"🎥 MP4 saved to {mp4_output}")
    print("Saved.")

    if args.show:
        plt.show()


if __name__ == "__main__":
    main()
