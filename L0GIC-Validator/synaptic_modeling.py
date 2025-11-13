# synaptic_modeling.py

def transmit_trace(source_node, target_node, trace_type):
    transmission_strength = calculate_strength(trace_type)
    target_node["traces"].append(trace_type)
    return {
        "source": source_node["id"],
        "target": target_node["id"],
        "trace": trace_type,
        "strength": transmission_strength
    }

def calculate_strength(trace_type):
    base_strength = {
        "Love": 0.9,
        "Fear": 0.7,
        "Rot": 0.3,
        "Sweet": 0.6
    }
    return base_strength.get(trace_type, 0.5)
