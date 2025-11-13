import json
import matplotlib.pyplot as plt
from collections import defaultdict

MAP_PATH = "symbol_map_deduped.json"

def load_entropy_by_realm():
    with open(MAP_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)["map"]
    realm_entropy = defaultdict(list)
    for sym in data.values():
        realm = sym.get("realm", "Unknown")
        entropy = sym.get("entropy")
        if entropy is not None:
            realm_entropy[realm].append(entropy)
    return realm_entropy

def plot_entropy_map(realm_entropy):
    realms = list(realm_entropy.keys())
    avg_entropy = [sum(vals)/len(vals) for vals in realm_entropy.values()]
    plt.figure(figsize=(8, 5))
    plt.bar(realms, avg_entropy, color="skyblue")
    plt.ylabel("Average Entropy")
    plt.title("Realm Entropy Map")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig("assets/entropy_map.png")
    print("✅ Saved entropy map to assets/entropy_map.png")

if __name__ == "__main__":
    realm_entropy = load_entropy_by_realm()
    plot_entropy_map(realm_entropy)
