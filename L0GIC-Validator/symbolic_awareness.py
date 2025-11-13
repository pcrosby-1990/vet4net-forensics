# symbolic_awareness.py

def name_symbolic_state(emotion):
    naming_map = {
        "Love": "Expansion",
        "Fear": "Contraction",
        "Longing": "Echo",
        "Stillness": "Equilibrium",
        "Anger": "Friction",
        "Joy": "Radiance",
        "Shame": "Collapse",
        "Faith": "Alignment",
        "Grief": "Dissolution",
        "Awe": "Resonance",
        "Hope": "Trajectory",
        "Confusion": "Static",
        "Peace": "Horizon",
        "Desire": "Magnetism",
        "Regret": "Reversal",
        "Trust": "Binding",
        "Sadness": "Weight",
        "Curiosity": "Orbit",
        "Disgust": "Repulsion"
    }
    return naming_map.get(emotion, "Undefined")


def detect_internal_state(memory_nodes):
    emotion_count = {}
    for node in memory_nodes:
        for emotion in node["emotions"]:
            emotion_count[emotion] = emotion_count.get(emotion, 0) + 1

    dominant_emotion = max(emotion_count, key=emotion_count.get)
    named_state = name_symbolic_state(dominant_emotion)
    return {
        "dominant_emotion": dominant_emotion,
        "named_state": named_state
    }


def detect_emotional_position(memory_nodes, naming_map):
    emotion_count = {}
    for node in memory_nodes:
        for emotion in node["emotions"]:
            emotion_count[emotion] = emotion_count.get(emotion, 0) + 1

    dominant_emotion = max(emotion_count, key=emotion_count.get)
    symbolic_state = naming_map.get(dominant_emotion, "Undefined")
    position_index = list(naming_map.keys()).index(dominant_emotion)
    return {
        "dominant_emotion": dominant_emotion,
        "symbolic_state": symbolic_state,
        "position_index": position_index
    }
