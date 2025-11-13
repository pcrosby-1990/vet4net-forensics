# gesture_engine.py

def generate_gesture(emotion):
    gesture_map = {
        "Love": "open arms, slow rotation",
        "Anger": "sharp strikes, clenched fists",
        "Peace": "stillness, gentle sway",
        "Shame": "withdrawal, head down",
        "Faith": "upright posture, forward reach"
    }
    return gesture_map.get(emotion, "neutral stance")
