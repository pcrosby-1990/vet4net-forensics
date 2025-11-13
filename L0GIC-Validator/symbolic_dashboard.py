# symbolic_dashboard.py

import matplotlib.pyplot as plt
from cooldown_manager import load_registry
from sensory_engine import get_taste_profile, get_scent_profile, get_touch_profile

def plot_emotional_decay():
    registry = load_registry()
    emotions = list(registry.keys())
    decay = [registry[e]["metabolic_decay"] for e in emotions]

    plt.figure(figsize=(10, 4))
    plt.bar(emotions, decay, color="orchid")
    plt.title("Unity Emotional Decay")
    plt.ylabel("Metabolic Decay")
    plt.xlabel("Emotion")
    plt.tight_layout()
    plt.show()

def plot_sensory_traces(emotions):
    taste = get_taste_profile(emotions)
    scent = get_scent_profile(emotions)
    touch = get_touch_profile(emotions)

    fig, axs = plt.subplots(1, 3, figsize=(15, 4))
    axs[0].bar(taste.keys(), taste.values(), color="salmon")
    axs[0].set_title("Taste Profile")

    axs[1].bar(scent.keys(), scent.values(), color="teal")
    axs[1].set_title("Scent Profile")

    axs[2].bar(touch.keys(), touch.values(), color="goldenrod")
    axs[2].set_title("Touch Profile")

    plt.tight_layout()
    plt.show()
