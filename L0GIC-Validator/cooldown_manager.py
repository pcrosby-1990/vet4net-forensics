import json
from datetime import datetime, timedelta

COOLDOWN_FILE = "cooldown_registry.json"

def load_registry():
    try:
        with open(COOLDOWN_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_registry(registry):
    with open(COOLDOWN_FILE, "w") as f:
        json.dump(registry, f, indent=2)

def update_cooldown(emotion, cooldown_period):
    registry = load_registry()
    now = datetime.utcnow()

    registry[emotion] = {
        "last_triggered": now.isoformat() + "Z",
        "cooldown_period": cooldown_period,
        "cooldown_remaining": cooldown_period,
        "status": "active"
    }

    save_registry(registry)

def check_cooldown(emotion):
    registry = load_registry()
    now = datetime.utcnow()

    if emotion not in registry:
        return True  # No cooldown set

    last_time = datetime.fromisoformat(registry[emotion]["last_triggered"].replace("Z", ""))
    elapsed = (now - last_time).total_seconds()
    remaining = registry[emotion]["cooldown_period"] - elapsed

    if remaining <= 0:
        registry[emotion]["cooldown_remaining"] = 0
        registry[emotion]["status"] = "clear"
        save_registry(registry)
        return True
    else:
        registry[emotion]["cooldown_remaining"] = round(remaining, 2)
        registry[emotion]["status"] = "active"
        save_registry(registry)
        return False

def get_remaining(emotion):
    registry = load_registry()
    return registry.get(emotion, {}).get("cooldown_remaining", 0)
