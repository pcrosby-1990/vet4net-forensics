# === terrain_audit.py ===

import json
from collections import Counter, defaultdict
from loop_detector import load_archive
from terrain_utils import EMOTIONAL_MAP

# === Audit Emotional Frequency ===
def audit_emotion_frequency(archive) -> Counter:
    return Counter(entry["emotion"] for entry in archive if "emotion" in entry)

# === Audit Glyph Usage ===
def audit_glyph_usage(archive) -> Counter:
    glyphs = []
    for entry in archive:
        glyphs.extend(entry.get("glyphs_activated", []))
    return Counter(glyphs)

# === Audit Trait Coverage ===
def audit_trait_coverage(archive) -> Counter:
    trait_counter = Counter()
    for entry in archive:
        emotion = entry.get("emotion")
        traits = EMOTIONAL_MAP.get(emotion, {}).get("traits", [])
        trait_counter.update(traits)
    return trait_counter

# === Detect Recursion-Heavy Emotions ===
def detect_recursion_flags(archive, threshold: int = 3) -> List[str]:
    recent = defaultdict(int)
    for entry in archive:
        emotion = entry.get("emotion")
        if emotion:
            recent[emotion] += 1
    return [emotion for emotion, count in recent.items() if count >= threshold]

# === Suggest Symbolic Rebalancing ===
def suggest_rebalancing(emotion_counts: Counter, trait_counts: Counter, glyph_counts: Counter) -> List[str]:
    suggestions = []

    # Underused emotions
    low_emotions = [e for e, c in emotion_counts.items() if c < 2]
    if low_emotions:
        suggestions.append(f"⚠️ Underused emotions: {', '.join(low_emotions)}")

    # Underused traits
    low_traits = [t for t, c in trait_counts.items() if c < 3]
    if low_traits:
        suggestions.append(f"🧬 Traits needing activation: {', '.join(low_traits)}")

    # Overused glyphs
    high_glyphs = [g for g, c in glyph_counts.items() if c > 10]
    if high_glyphs:
        suggestions.append(f"🌀 Glyphs dominating terrain: {', '.join(high_glyphs)}")

    return suggestions

# === Run Full Audit ===
def run_terrain_audit():
    archive = load_archive()

    emotion_counts = audit_emotion_frequency(archive)
    glyph_counts = audit_glyph_usage(archive)
    trait_counts = audit_trait_coverage(archive)
    recursion_flags = detect_recursion_flags(archive)
    rebalancing = suggest_rebalancing(emotion_counts, trait_counts, glyph_counts)

    print("\n📊 Terrain Audit Report")
    print("------------------------")
    print("🧠 Emotion Frequency:")
    for emotion, count in emotion_counts.most_common():
        print(f"  - {emotion}: {count}")

    print("\n🔮 Glyph Usage:")
    for glyph, count in glyph_counts.most_common():
        print(f"  - {glyph}: {count}")

    print("\n🧬 Trait Coverage:")
    for trait, count in trait_counts.most_common():
        print(f"  - {trait}: {count}")

    print("\n🌀 Recursion Flags:")
    for emotion in recursion_flags:
        print(f"  - {emotion} (looping)")

    print("\n🧭 Symbolic Rebalancing Suggestions:")
    for suggestion in rebalancing:
        print(f"  {suggestion}")
