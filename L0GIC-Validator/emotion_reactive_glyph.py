emotion_map = {
    "joy": (0.1, 0.3),
    "sadness": (0.6, 0.8),
    "awe": (0.8, 1.0),
    "tension": (0.4, 0.6)
}

selected_emotion = st.selectbox("Choose an emotion", list(emotion_map.keys()))
low, high = emotion_map[selected_emotion]
matching = [s for s in symbols if s["entropy"] and low <= s["entropy"] <= high]
