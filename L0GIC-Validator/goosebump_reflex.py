# goosebump_reflex.py

def trigger_goosebumps(emotion, stimulus):
    if emotion in ["Awe", "Fear", "Longing"] or stimulus == "Cold":
        return {
            "skin_response": "ripple",
            "hair_state": "erect",
            "breath": "shiver",
            "status": "symbolic goosebumps triggered"
        }
    return {"status": "no response"}
