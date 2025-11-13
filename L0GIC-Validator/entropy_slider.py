entropy_val = st.slider("🌀 Entropy Level", 0.0, 1.0, 0.5, step=0.01)
emotion_matches = [e for e, (low, high) in EMOTION_ENTROPY_MAP.items() if low <= entropy_val <= high]
matching_symbols = [s for s in symbols if s["entropy"] and abs(s["entropy"] - entropy_val) < 0.05]
