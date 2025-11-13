# === symbolic_analysis.py ===

from collections import Counter
from typing import List, Dict

def generate_rebalancing_suggestions(fragments: List[dict]) -> Dict[str, object]:
    """
    Analyzes emotion and glyph frequency to suggest symbolic rebalancing.
    
    Returns:
        dict with keys:
            - dominant_emotions: Top 3 most frequent emotions
            - overused_glyphs: Top 5 most frequent glyphs
            - underused_glyphs: Glyphs that appear only once
    """
    emotion_counter = Counter()
    glyph_counter = Counter()

    for frag in fragments:
        emotion = frag.get("emotion")
        glyphs = frag.get("glyphs_activated", [])
        if emotion:
            emotion_counter[emotion] += 1
        glyph_counter.update(glyphs)

    suggestions = {
        "dominant_emotions": emotion_counter.most_common(3),
        "overused_glyphs": glyph_counter.most_common(5),
        "underused_glyphs": [g for g, c in glyph_counter.items() if c == 1]
    }

    return suggestions

def print_rebalancing_report(suggestions: Dict[str, object]) -> None:
    """
    Prints a formatted symbolic rebalancing report.
    """
    print("\n🧭 Symbolic Rebalancing Suggestions")
    print("-" * 30)

    print("Dominant Emotions:")
    for emotion, count in suggestions["dominant_emotions"]:
        print(f"  - {emotion}: {count}")

    print("\nOverused Glyphs:")
    for glyph, count in suggestions["overused_glyphs"]:
        print(f"  - {glyph}: {count}")

    print("\nUnderused Glyphs:")
    for glyph in suggestions["underused_glyphs"]:
        print(f"  - {glyph}")
