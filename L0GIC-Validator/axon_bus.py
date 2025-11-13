# axon_bus.py

def transmit_packet(source, target, payload):
    if validate_payload(payload):
        return {
            "from": source,
            "to": target,
            "payload": payload,
            "status": "transmitted"
        }
    return {"status": "blocked", "reason": "invalid payload"}

def validate_payload(payload):
    return "emotion" in payload or "symbol" in payload
