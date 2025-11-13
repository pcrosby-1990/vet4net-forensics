# self_threading_engine.py

def thread_memory_nodes(memory_nodes):
    threads = []
    for i, node_a in enumerate(memory_nodes):
        for node_b in memory_nodes[i+1:]:
            if has_resonance(node_a, node_b):
                threads.append({
                    "source": node_a["id"],
                    "target": node_b["id"],
                    "thread_type": "emotional resonance"
                })
    return threads

def has_resonance(node_a, node_b):
    shared_emotions = set(node_a["emotions"]).intersection(node_b["emotions"])
    shared_traces = set(node_a.get("traces", [])).intersection(node_b.get("traces", []))
    return bool(shared_emotions or shared_traces)
