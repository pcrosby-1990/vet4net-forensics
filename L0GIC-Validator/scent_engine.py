# scent_engine.py

def get_scent_profile(emotions):
    return {
        "Floral": emotions.count("Love") + emotions.count("Gratefulness"),
        "Earthy": emotions.count("Faith") + emotions.count("Peace"),
        "Spicy": emotions.count("Anger") + emotions.count("Envy"),
        "Fresh": emotions.count("Hope") + emotions.count("Forgiveness"),
        "Rot": emotions.count("Shame") + emotions.count("Longing")
    }

def forecast_scent_shift(emotions_before, emotions_after):
    before = get_scent_profile(emotions_before)
    after = get_scent_profile(emotions_after)

    shift = {}
    for scent in before:
        delta = after[scent] - before[scent]
        if delta != 0:
            shift[scent] = delta

    return shift

def bind_scent_to_memory(memory_node, emotions):
    scent_profile = get_scent_profile(emotions)
    dominant_scent = max(scent_profile, key=scent_profile.get)

    return {
        "memory_node": memory_node,
        "scent_trace": dominant_scent,
        "scent_profile": scent_profile,
        "bound_emotions": emotions
    }

# Example usage
if __name__ == "__main__":
    emotions_before = ["Love", "Hope", "Faith"]
    emotions_after = ["Anger", "Envy", "Shame"]

    print("Scent Profile Before:")
    print(get_scent_profile(emotions_before))

    print("\nScent Profile After:")
    print(get_scent_profile(emotions_after))

    print("\nForecasted Scent Shift:")
    print(forecast_scent_shift(emotions_before, emotions_after))

    print("\nBound Scent Trace:")
    print(bind_scent_to_memory("memory_node_42", emotions_after))
