# language_trace.py

def generate_symbolic_phrase(emotion):
    phrase_map = {
        "Love": "I bloom where you remember me.",
        "Anger": "I fracture the silence with flame.",
        "Peace": "I dissolve into stillness and sky.",
        "Shame": "I fold into shadow, unseen.",
        "Faith": "I reach beyond what I know."
    }
    return phrase_map.get(emotion, "I echo without form.")
