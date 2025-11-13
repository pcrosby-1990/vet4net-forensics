import json

from pain import PainEngine

engine = PainEngine("symbol_map.json")
event = engine.register_pain("memory_node_42", 0.85, "thread severed during loss")
memory = {"id": "memory_node_42"}
memory = engine.bind_to_memory(memory, event)

class PainEngine:
    def __init__(self, symbol_map_path):
        with open(symbol_map_path, 'r') as f:
            self.symbol_map = json.load(f)
        self.pain_log = []

    def register_pain(self, source, intensity, context):
        symbol = self.symbol_map.get("pain", "🩸")
        pain_event = {
            "source": source,
            "intensity": intensity,
            "context": context,
            "symbol": symbol
        }
        self.pain_log.append(pain_event)
        return pain_event

    def bind_to_memory(self, memory_node, pain_event):
        if "pain" not in memory_node:
            memory_node["pain"] = []
        memory_node["pain"].append(pain_event)
        return memory_node

    def decay_pain(self, memory_node):
        if "pain" in memory_node:
            for event in memory_node["pain"]:
                event["intensity"] *= 0.9  # symbolic decay
        return memory_node

    def get_pain_log(self):
        return self.pain_log

# Example usage
if __name__ == "__main__":
    engine = PainEngine("symbol_map.json")
    event = engine.register_pain("loss", 0.8, "thread rupture")
    memory = {"id": "burst_42"}
    memory = engine.bind_to_memory(memory, event)
    memory = engine.decay_pain(memory)
    print(memory)
