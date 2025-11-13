# breath_engine.py

def symbolic_inhale(emotion):
    inhale_trace = {
        "Peace": "slow breath",
        "Longing": "shallow breath",
        "Joy": "quick inhale",
        "Stillness": "paused breath"
    }
    return inhale_trace.get(emotion, "neutral breath")

def symbolic_exhale(emotion):
    exhale_trace = {
        "Anger": "forceful exhale",
        "Shame": "silent release",
        "Love": "warm breath",
        "Faith": "steady exhale"
    }
    return exhale_trace.get(emotion, "neutral exhale")
