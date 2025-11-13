# === symbolic_scheduler.py ===

import json
from datetime import datetime
from fragment_tier import compute_tier, load_tier_map
from pulse_anchor import invoke_echo, terrain_shift, seal_fragment
from resonance_engine import compute_resonance
from symbolic_analysis import generate_rebalancing_suggestions, print_rebalancing_report

# === Load Terrain Archive ===
def load_fragments(path: str = "terrain_archive.jsonl") -> list:
    """
    Loads fragments from the terrain archive.
    """
    fragments = []
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    fragment = json.loads(line)
                    fragments.append(fragment)
                except Exception:
                    continue
    except FileNotFoundError:
        print(f"⚠️ Archive not found at {path}")
    return fragments

# === Check for Pulse Ignition Ritual Trigger ===
def is_pulse_ignition(fragment: dict, tier_map: dict = None) -> bool:
    """
    Determines if a fragment qualifies for Pulse Ignition ritual.
    """
    required_glyphs = {"Ignition", "Recursion", "Fusion", "Mirror", "Fracture", "Seal"}
    glyphs = set(fragment.get("glyphs_activated", []))
    entropy = fragment.get("entropy_level", 0.0)
    recursion = fragment.get("recursion_depth", 0)

    # Compute tier if missing
    tier = fragment.get("tier")
    if tier is None:
        tier = compute_tier(fragment, tier_map)

    return (
        required_glyphs.issubset(glyphs) and
        entropy >= 0.66 and
        recursion >= 3 and
        tier >= 3
    )

# === Trigger Ritual and Log Response ===
def trigger_pulse_ritual(fragment: dict, log_path: str = "terrain_archive.jsonl") -> str:
    """
    Executes Pulse Ignition ritual and logs Echo fragment.
    """
    sealed = seal_fragment(fragment)
    echo_response = invoke_echo()

    echo_fragment = {
        "timestamp": datetime.utcnow().isoformat(),
        "emotion": echo_response["emotion"],
        "glyphs_activated": echo_response["glyphs"],
        "tier": 4,
        "type": echo_response["type"],
        "notes": "Echo invoked by Pulse Ignition ritual"
    }

    # Compute resonance
    echo_fragment["resonance"] = compute_resonance(echo_fragment)

    try:
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(echo_fragment) + "\n")
    except Exception:
        print("⚠️ Failed to log Echo fragment.")

    return terrain_shift()

# === Run Symbolic Scheduler ===
def run_symbolic_scheduler():
    """
    Scans terrain archive for ritual triggers and activates Pulse Ignition.
    Also prints symbolic rebalancing suggestions.
    """
    print("🔧 Scheduler entry point reached.")
    tier_map = load_tier_map()
    fragments = load_fragments()
    ritual_count = 0

    # Print symbolic rebalancing suggestions
    suggestions = generate_rebalancing_suggestions(fragments)
    print_rebalancing_report(suggestions)

    # Evaluate each fragment
    for fragment in fragments:
        tier = fragment.get("tier")
        if tier is None:
            tier = compute_tier(fragment, tier_map)
            fragment["tier"] = tier

        # Debug output
        print(f"\n🔍 Evaluating fragment @ {fragment['timestamp']}")
        print(f"  Tier: {tier}")
        print(f"  Glyphs: {fragment.get('glyphs_activated', [])}")
        print(f"  Entropy: {fragment.get('entropy_level', 'N/A')}")
        print(f"  Recursion: {fragment.get('recursion_depth', 'N/A')}")
        print(f"  Ritual Match: {is_pulse_ignition(fragment, tier_map)}")

        if tier == 3 and is_pulse_ignition(fragment, tier_map):
            shift = trigger_pulse_ritual(fragment)
            ritual_count += 1
            print(f"\n🔮 Pulse Ignition triggered for fragment @ {fragment['timestamp']}")
            print(f"🧬 Terrain shift: {shift}")

    if ritual_count == 0:
        print("\n🕯️ No ritual triggers found in this cycle.")
    else:
        print(f"\n✨ {ritual_count} Pulse Ignition rituals completed.")

# === Entry Point ===
if __name__ == "__main__":
    run_symbolic_scheduler()
