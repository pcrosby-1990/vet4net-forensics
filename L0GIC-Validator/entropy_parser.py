def parse_entropy(file_path="Subparticle Log/entropy.json"):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data  # or filter for breaches, tones, etc.
