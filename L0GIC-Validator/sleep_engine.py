# sleep_engine.py

from memory_engine import decay_memory_node, rebind_fragments
from dream_generator import generate_dream

def enter_sleep_cycle(memory_nodes):
    decayed = [decay_memory_node(node) for node in memory_nodes]
    rebound = rebind_fragments(decayed)
    dream = generate_dream(rebound)
    return {
        "decayed_nodes": decayed,
        "rebound_nodes": rebound,
        "dream": dream
    }
