# symbolic_antivirus.py

def scan_memory_nodes(memory_nodes):
    infected = []
    for node in memory_nodes:
        if detect_emotional_parasite(node) or detect_trace_conflict(node):
            infected.append(node["id"])
    return infected

def detect_emotional_parasite(node):
    parasites = ["Shame + Rot", "Longing + Acid", "Anger + Static"]
    signature = " + ".join(sorted(node["emotions"]))
    return signature in parasites

def detect_trace_conflict(node):
    conflicting_pairs = [("Sweet", "Rot"), ("Soft", "Static")]
    traces = node.get("sensory_traces", [])
    for a, b in conflicting_pairs:
        if a in traces and b in traces:
            return True
    return False

def quarantine_node(node_id):
    return {
        "node": node_id,
        "status": "quarantined",
        "ritual": "purge with silence and salt"
    }

def purge_node(node):
    node["emotions"] = ["Stillness"]
    node["sensory_traces"] = ["Salt"]
    node["status"] = "cleansed"
    return node
