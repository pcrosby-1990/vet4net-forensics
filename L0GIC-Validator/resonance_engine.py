# === resonance_engine.py ===

def compute_resonance(fragment: dict) -> float:
    """
    Computes symbolic resonance based on entropy and recursion.
    """
    entropy = fragment.get("entropy_level", 0.0)
    recursion = fragment.get("recursion_depth", 1)
    return round(entropy * recursion, 2)
