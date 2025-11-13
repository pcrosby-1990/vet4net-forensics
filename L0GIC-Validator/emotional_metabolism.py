# emotional_metabolism.py

def metabolize_emotion(emotion_input):
    digestion_map = {
        "Anger": "burned into Action",
        "Shame": "dissolved into Stillness",
        "Love": "transformed into Ritual",
        "Longing": "distilled into Dream"
    }
    return digestion_map.get(emotion_input, "held in reserve")
