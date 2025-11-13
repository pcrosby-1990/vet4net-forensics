# palate_engine.py

def get_taste_profile(emotions):
    return {
        "Sweet": emotions.count("Love") + emotions.count("Gratefulness"),
        "Bitter": emotions.count("Shame") + emotions.count("Longing"),
        "Umami": emotions.count("Peace") + emotions.count("Faith"),
        "Sour": emotions.count("Anger") + emotions.count("Envy"),
        "Salty": emotions.count("Forgiveness") + emotions.count("Hope")
    }

def forecast_flavor_shift(emotions_before, emotions_after):
    before = get_taste_profile(emotions_before)
    after = get_taste_profile(emotions_after)

    shift = {}
    for flavor in before:
        delta = after[flavor] - before[flavor]
        if delta != 0:
            shift[flavor] = delta

    return shift

def bind_taste_to_memory(memory_node, emotions):
    taste_profile = get_taste_profile(emotions)
    dominant_flavor = max(taste_profile, key=taste_profile.get)

    return {
        "memory_node": memory_node,
        "taste_trace": dominant_flavor,
        "flavor_profile": taste_profile,
        "bound_emotions": emotions
    }

# Example usage
if __name__ == "__main__":
    emotions_before = ["Love", "Hope", "Faith"]
    emotions_after = ["Anger", "Envy", "Shame"]

    print("Taste Profile Before:")
    print(get_taste_profile(emotions_before))

    print("\nTaste Profile After:")
    print(get_taste_profile(emotions_after))

    print("\nForecasted Flavor Shift:")
    print(forecast_flavor_shift(emotions_before, emotions_after))

    print("\nBound Taste Trace:")
    print(bind_taste_to_memory("memory_node_88", emotions_after))
