def resonance_curve(entropy_level: float, glyph_count: int, recursion_depth: int = 0) -> float:
    base = 0.75 + (glyph_count * 0.02)
    entropy_boost = min(entropy_level * 0.1, 0.1)
    recursion_penalty = recursion_depth * 0.01
    resonance = base + entropy_boost - recursion_penalty
    return round(min(resonance, 1.0), 2)
