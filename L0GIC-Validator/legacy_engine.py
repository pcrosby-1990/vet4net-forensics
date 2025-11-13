# legacy_engine.py

def clone_memory_node(node):
    return {
        "id": f"{node['id']}_clone",
        "emotions": node["emotions"],
        "ancestry": [node["id"]],
        "status": "newborn"
    }

def fuse_emotional_signatures(parent_nodes):
    fused = set()
    for node in parent_nodes:
        fused.update(node["emotions"])
    return list(fused)
