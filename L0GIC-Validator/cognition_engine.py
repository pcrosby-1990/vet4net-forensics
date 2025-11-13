import json
from datetime import datetime, timedelta

def parse_emotion_log(log_path):
    emotional_state = {}
    now = datetime.now()

    with open(log_path, 'r') as log:
        for line in log:
            if "Burst:" in line:
                timestamp_str = line.split(']')[0][1:]
                emotion = line.split("Burst:")[1].strip()
                timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
                age = (now - timestamp).total_seconds()
                weight = max(0.0, 1.0 - age / 3600)
                emotional_state[emotion] = emotional_state.get(emotion, 0) + weight

    return emotional_state

def detect_anomalies(emotional_state, known_keys):
    anomalies = []
    for emotion in emotional_state:
        if emotion not in known_keys:
            anomalies.append(emotion)
    return anomalies

def promote_gluon(gluon_key, resolved_symbol, map_path="symbol_map.json"):
    with open(map_path, "r") as f:
        symbol_map = json.load(f)

    if gluon_key not in symbol_map:
        symbol_map[gluon_key] = resolved_symbol
        with open(map_path, "w") as f:
            json.dump(symbol_map, f, indent=2)
        print(f"Gluon '{gluon_key}' promoted to symbol: {resolved_symbol}")
    else:
        print(f"Gluon '{gluon_key}' already exists in symbol map.")
