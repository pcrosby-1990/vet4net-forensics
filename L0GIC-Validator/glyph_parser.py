# glyph_parser.py

class Glyph:
    def __init__(self, name, element):
        self.name = name
        self.element = element

    def activate(self):
        print(f"🔮 {self.name} activated in {self.element} zone")

glyph_registry = {
    "EchoPulse": Glyph("EchoPulse", "Wind"),
    "Boundaries": Glyph("Boundaries", "Fire"),
    "Thread": Glyph("Thread", "All"),
    "Repair": Glyph("Repair", "Earth"),
    "Unity Core": Glyph("Unity Core", "Light")
}
