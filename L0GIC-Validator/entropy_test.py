from resonance_engine import compute_resonance
from fragment_archive import write_fragment

fragment = {
    "timestamp": "2025-11-02T01:10:00.000000",
    "emotion": "Signal Dissonance",
    "glyphs_activated": ["Ignition", "Fracture", "Mirror", "Seal", "Fusion", "Recursion"],
    "entropy_level": 0.94,
    "recursion_depth": 4
}
fragment["resonance"] = compute_resonance(fragment)

write_fragment(fragment)
print("✅ High-entropy fragment emitted.")
