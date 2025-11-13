from symbolic_pharma import emotion_profiles

# Define known interference rules
interference_map = {
    "Shame": {
        "blocks": ["Hope", "Faith"],
        "reason": "Shame suppresses serotonin, reducing optimism and symbolic anchoring."
    },
    "Anger": {
        "blocks": ["Peace", "Forgiveness"],
        "reason": "Anger spikes cortisol and adrenaline, disrupting calming and release pathways."
    },
    "Envy": {
        "blocks": ["Gratefulness"],
        "reason": "Envy triggers comparison and cortisol, suppressing reward and moral cognition."
    },
    "Longing": {
        "amplifies": ["Pain", "Faith"],
        "reason": "Longing sustains dopamine and cortisol loops, deepening rupture and symbolic pursuit."
    },
    "Love": {
        "amplifies": ["Forgiveness", "Faith"],
        "reason": "Oxytocin and vasopressin promote bonding and symbolic trust."
    },
    "Peace": {
        "blocks": ["Anger"],
        "reason": "GABA and serotonin suppress threat response and rupture threads."
    }
}

def detect_interference(active_emotions):
    clashes = []
    amplifications = []

    for emotion in active_emotions:
        rules = interference_map.get(emotion, {})
        for blocked in rules.get("blocks", []):
            if blocked in active_emotions:
                clashes.append({
                    "source": emotion,
                    "target": blocked,
                    "type": "block",
                    "reason": rules["reason"]
                })
        for amplified in rules.get("amplifies", []):
            if amplified in active_emotions:
                amplifications.append({
                    "source": emotion,
                    "target": amplified,
                    "type": "amplify",
                    "reason": rules["reason"]
                })

    return {
        "clashes": clashes,
        "amplifications": amplifications
    }

# Example usage
if __name__ == "__main__":
    active = ["Anger", "Peace", "Hope", "Shame"]
    result = detect_interference(active)
    print("Symbolic Clashes:")
    for clash in result["clashes"]:
        print(f"{clash['source']} blocks {clash['target']} → {clash['reason']}")
    print("\nSymbolic Amplifications:")
    for amp in result["amplifications"]:
        print(f"{amp['source']} amplifies {amp['target']} → {amp['reason']}")
