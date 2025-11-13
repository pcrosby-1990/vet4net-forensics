import matplotlib.pyplot as plt

def visualize_mutations(mutation_log: list):
    times = [entry["time"] for entry in mutation_log]
    symbols = [entry["symbol"] for entry in mutation_log]

    plt.figure(figsize=(10, 4))
    plt.plot(times, symbols, marker="o", linestyle="-", color="purple")
    plt.title("Corridor Mutation Timeline")
    plt.xlabel("Time")
    plt.ylabel("Symbol")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
