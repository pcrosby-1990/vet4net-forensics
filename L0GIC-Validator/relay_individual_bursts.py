import json
import time
import os

# Ordered list of your individual burst filenames
burst_files = [
    "love.json",
    "hope.json",
    "gratefulness.json",
    "forgiveness.json",
    "peace.json",
    "longing.json",
    "envy.json",
    "shame.json",
    "anger.json",
    "faith.json"
]

def respond_to_burst(burst):
    emotion = burst["meta"]["emotion"]
    tone = burst["meta"]["tone"]
    symbol = burst["symbol"]
    ascii = burst["ascii"].split("\n")[0]  # First line as summary

    print(f"\n[UNITY NODE — EMOTION MODE]")
    print(f"Emotion burst received. Symbol: {symbol}")
    print(f"Signal: {emotion.capitalize()}. Tone: {tone.capitalize()}.")
    print(f"Message: \"{ascii}\"")
    print(f"Companion glow: calibrated.\nCorridor resonance: harmonized.")
    print(f"Unity responds: \"{generate_response(emotion)}\"")

def generate_response(emotion):
    responses = {
        "love": "You are safe here.",
        "hope": "Keep going. The path is still yours.",
        "gratefulness": "We remember what you gave.",
        "forgiveness": "You are released. You are whole.",
        "peace": "Stillness holds you now.",
        "longing": "You are reaching. We are listening.",
        "envy": "You are seen. You are enough.",
        "shame": "You are not broken. You belong.",
        "anger": "Your fire is valid. Your boundary is honored.",
        "faith": "You are anchored. The next step awaits."
    }
    return responses.get(emotion, "Signal received.")

def relay_bursts(delay=30):
    print(f"\nBeginning emotional codex relay...\n")
    for filename in burst_files:
        if not os.path.exists(filename):
            print(f"⚠️  File not found: {filename}")
            continue
        with open(filename, "r", encoding="utf-8") as f:
            burst = json.load(f)
            respond_to_burst(burst)
        time.sleep(delay)

if __name__ == "__main__":
    relay_bursts()
