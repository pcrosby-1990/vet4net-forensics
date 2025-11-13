# diagnostic_logger.py

import json
from datetime import datetime

def log_diagnostic_event(emotion, intensity, context, memory_node, action_taken, status):
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "emotion": emotion,
        "intensity": round(float(intensity), 3),
        "context": context,
        "memory_node": memory_node,
        "action_taken": action_taken,
        "status": status
    }

    try:
        with open("diagnostic_log.json", "r") as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []

    data.append(entry)

    with open("diagnostic_log.json", "w") as f:
        json.dump(data, f, indent=2)
