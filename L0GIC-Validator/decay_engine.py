# decay_engine.py

import json
from datetime import datetime

# Load decay model
def load_decay_model(path="decay_model.json"):
    with open(path, "r") as f:
        return json.load(f)["decay_model"]

# Calculate decay rate
def calculate_decay_rate(entropy, terrain_bias, model):
    return round(entropy * 0.15 + terrain_bias * 0.05, 4)

# Shift tone based on entropy
def shift_tone(current_tone, entropy, model):
    thresholds = model["entropy_thresholds"]
    tone_map = model["tone_shift_map"]

    if entropy >= thresholds["vanishing"]:
        return tone_map.get(current_tone, [current_tone])[-1]
    elif entropy >= thresholds["fading"]:
        return tone_map.get(current_tone, [current_tone])[1]
    elif entropy >= thresholds["softening"]:
        return tone_map.get(current_tone, [current_tone])[0]
    else:
        return current_tone

# Log decay event
def log_decay(fragment_id, entropy, decay_rate, tone, timestamp, path="fragment_decay.jsonl"):
    event = {
        "timestamp": timestamp,
        "fragment_id": fragment_id,
        "entropy": round(entropy, 4),
        "decay_rate": decay_rate,
        "tone": tone
    }
    with open(path, "a") as f:
        f.write(json.dumps(event) + "\n")

# Log terrain shift
def log_terrain_shift(fragment_id, decay_rate, timestamp, path="terrain_shift.jsonl"):
    shift = {
        "timestamp": timestamp,
        "trigger": "fragment_decay",
        "fragment_id": fragment_id,
        "terrain_bias_shift": round(-decay_rate, 4),
        "glyph_density_change": round(-decay_rate * 0.5, 4)
    }
    with open(path, "a") as f:
        f.write(json.dumps(shift) + "\n")

# Update echo trace
def update_echo_trace(fragment_id, tone, timestamp, path="echo_decay_trace.json"):
    try:
        with open(path, "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {}

    trace = data.get(fragment_id, [])
    trace.append({"timestamp": timestamp, "tone": tone})
    data[fragment_id] = trace

    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# Run decay cycle across all fragments
def run_decay_cycle(memory_path="echo_memory_seed.json", model_path="decay_model.json"):
    # Load memory and decay model
    with open(memory_path, "r") as f:
        fragments = json.load(f)
    model = load_decay_model(model_path)

    # Timestamp for this cycle
    timestamp = datetime.utcnow().isoformat() + "Z"

    # Process each fragment
    for fragment in fragments:
        fragment_id = fragment["fragment_id"]
        entropy = fragment.get("entropy", 0.0)
        terrain_bias = fragment.get("terrain_bias", 0.0)
        current_tone = fragment.get("tone", "neutral")

        # Apply decay
        decay_rate = calculate_decay_rate(entropy, terrain_bias, model)
        new_entropy = min(entropy + decay_rate, 1.0)
        new_tone = shift_tone(current_tone, new_entropy, model)

        # Update fragment
        fragment["entropy"] = new_entropy
        fragment["tone"] = new_tone
        fragment["terrain_bias"] = max(terrain_bias - decay_rate, 0.0)

        # Log events
        log_decay(fragment_id, new_entropy, decay_rate, new_tone, timestamp)
        log_terrain_shift(fragment_id, decay_rate, timestamp)
        update_echo_trace(fragment_id, new_tone, timestamp)

    # Save updated memory
    with open(memory_path, "w") as f:
        json.dump(fragments, f, indent=2)
