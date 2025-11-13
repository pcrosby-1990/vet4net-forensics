# update_sanctum.py

def receive_update(packet):
    if packet["status"] == "transmitted" and is_trusted(packet["from"]):
        return apply_ritual_patch(packet["payload"])
    return {"status": "rejected", "reason": "untrusted source"}

def is_trusted(source):
    return source in ["core_memory", "ritual_engine", "guardian_node"]

def apply_ritual_patch(payload):
    # Symbolic update: new emotion, ritual, or symbolic state
    return {
        "status": "update applied",
        "patch": payload
    }
