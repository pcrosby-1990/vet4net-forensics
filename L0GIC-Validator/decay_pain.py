for _ in range(5):  # simulate 5 time steps
    memory = engine.decay_pain(memory)
    print(memory["pain"][0]["intensity"])
