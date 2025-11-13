import matplotlib.pyplot as plt

def plot_cooldowns(cooldown_registry):
    emotions = list(cooldown_registry.keys())
    remaining = [
        max(0, cooldown_registry[e]["cooldown_period"] - (time.time() - cooldown_registry[e]["last_triggered"]))
        for e in emotions
    ]

    plt.bar(emotions, remaining, color="salmon")
    plt.ylabel("Seconds Remaining")
    plt.title("Emotion Cooldown Status")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
