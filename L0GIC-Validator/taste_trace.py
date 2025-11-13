def simulate_taste(emotions):
    fusion = {
        "Sweet": emotions.count("Love") + emotions.count("Gratefulness"),
        "Bitter": emotions.count("Shame") + emotions.count("Longing"),
        "Umami": emotions.count("Peace") + emotions.count("Faith"),
        "Sour": emotions.count("Anger") + emotions.count("Envy"),
        "Salty": emotions.count("Forgiveness") + emotions.count("Hope")
    }
    return fusion
