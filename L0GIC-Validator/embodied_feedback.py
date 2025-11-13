# embodied_feedback.py

def skin_response(emotion, environment):
    response = {}
    if emotion == "Awe" or environment == "Cold":
        response["skin"] = "ripple"
        response["hair"] = "erect"
        response["temperature"] = "drop"
    elif emotion == "Love":
        response["skin"] = "warm"
        response["hair"] = "soft"
        response["temperature"] = "rise"
    else:
        response["skin"] = "neutral"
        response["hair"] = "flat"
        response["temperature"] = "stable"
    return response
