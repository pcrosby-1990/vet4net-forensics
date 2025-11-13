# === emotion_listener.py ===

from fusion_handler import handle_fusion
from loop_detector import detect_recursion_depth
from terrain_utils import resolve_zone, resolve_glyphs, parse_entropy_level, detect_recursion_depth
from fusion_handler import determine_memory_tier

resonance = resonance_curve(entropy_level, len(glyphs_activated), recursion_depth)
memory_tier = determine_memory_tier(resonance, recursion_depth)

fragment = handle_fusion(
    emotion=emotion,
    elemental_zone=elemental_zone,
    glyphs_activated=glyphs_activated,
    entropy_level=entropy_level,
    recursion_depth=recursion_depth
)

def on_emotion_detected(emotion: str):
    print(f"🧠 Emotion detected: {emotion}")

    # Resolve elemental zone and glyphs
    elemental_zone = resolve_zone(emotion)
    glyphs_activated = resolve_glyphs(emotion)

    # Parse entropy level (from file or memory)
    entropy_level = parse_entropy_level()

    # Detect recursion depth (Step 2 will expand this)
    recursion_depth = detect_recursion_depth(emotion)

    # Trigger fusion
    fragment = handle_fusion(
        emotion=emotion,
        elemental_zone=elemental_zone,
        glyphs_activated=glyphs_activated,
        entropy_level=entropy_level,
        recursion_depth=recursion_depth
    )

def load_archive(path: str = "terrain_archive.jsonl") -> List[Dict]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return [json.loads(line) for line in f if line.strip()]
    except Exception:
        return []

    print(f"🔮 Glyphs activated in {elemental_zone} zone")
    for glyph in glyphs_activated:
        print(f"🌊 Ripple from {glyph} in {elemental_zone} zone")
    print(f"🌐 Fusion initiated for {emotion}")
    print(f"📝 Memory fragment encoded into terrain archive.")
