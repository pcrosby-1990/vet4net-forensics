st.title("🧠 Symbol Browser")
st.caption(f"Showing {len(filtered)} of {len(symbols)} symbols")

cols = st.columns(GRID_COLUMNS)
for i, symbol in enumerate(filtered):
    with cols[i % GRID_COLUMNS]:
        color = REALM_COLORS.get(symbol["realm"], "#D3D3D3")
        st.markdown(f"<div style='border:2px solid {color}; padding:10px; border-radius:6px;'>", unsafe_allow_html=True)

        st.markdown(f"### {symbol['char']}")
        glyph_path = os.path.join(GLYPH_DIR, os.path.basename(symbol["image"])) if symbol["image"] else None
        if glyph_path and os.path.exists(glyph_path):
            st.image(glyph_path, width=80)
        else:
            st.markdown("🖼️ *(No glyph)*")

        st.markdown(f"**{symbol['uid']}**")
        st.markdown(f"*{symbol['realm']} · {symbol['tier']}*")
        if symbol["entropy"] is not None:
            st.markdown(f"Entropy: `{symbol['entropy']:.2f}`")

        if st.button(f"🔍 View {symbol['uid']}", key=f"view_{i}"):
            st.session_state["selected_symbol"] = symbol

        st.markdown("</div>", unsafe_allow_html=True)
if "selected_symbol" in st.session_state:
    sym = st.session_state["selected_symbol"]
    st.markdown("---")
    st.subheader(f"🔎 {sym['uid']} — Detailed View")

    if sym["uid"] not in st.session_state["memory"]["viewed"]:
        st.session_state["memory"]["viewed"].append(sym["uid"])
    st.session_state["memory"]["last_viewed"] = sym["uid"]

    glyph_path = os.path.join(GLYPH_DIR, os.path.basename(sym["image"])) if sym["image"] else None
    if glyph_path and os.path.exists(glyph_path):
        st.image(glyph_path, width=160)

    st.markdown(f"**Character:** {sym['char']}")
    st.markdown(f"**Realm:** {sym['realm']}")
    st.markdown(f"**Tier:** {sym['tier']}")
    st.markdown(f"**Aliases:** {', '.join(sym['aliases']) or 'None'}")
    if sym["entropy"] is not None:
        st.markdown(f"**Entropy:** `{sym['entropy']:.4f}`")

    if st.button("⭐ Favorite this symbol"):
        if sym["uid"] not in st.session_state["memory"]["favorites"]:
            st.session_state["memory"]["favorites"].append(sym["uid"])

    try:
        sim_matrix = np.load("similarity_matrix.npy")
        names = np.load("glyph_names.npy")
        idx = names.tolist().index(os.path.basename(sym["image"]))
        scores = sim_matrix[idx]
        top_indices = np.argsort(scores)[::-1][1:6]
        st.markdown("### 🔗 Similar Glyphs")
        for i in top_indices:
            fname = names[i]
            score = scores[i]
            path = os.path.join(GLYPH_DIR, fname)
            if os.path.exists(path):
                st.image(path, width=60, caption=f"{fname} ({score:.2f})")
    except Exception:
        st.info("Similarity data not available. Run `symbol_similarity.py` to generate it.")
with st.expander("🎭 Emotion-Reactive Glyphs"):
    selected_emotion = st.selectbox("Choose an emotion", list(EMOTION_ENTROPY_MAP.keys()))
    low, high = EMOTION_ENTROPY_MAP[selected_emotion]
    matching = [s for s in symbols if s["entropy"] and low <= s["entropy"] <= high]

    st.markdown(f"Showing {len(matching)} glyphs for **{selected_emotion}** (entropy {low:.2f}–{high:.2f})")
    cols = st.columns(GRID_COLUMNS)
    for i, symbol in enumerate(matching[:GRID_COLUMNS * 4]):
        with cols[i % GRID_COLUMNS]:
            glyph_path = os.path.join(GLYPH_DIR, os.path.basename(symbol["image"])) if symbol["image"] else None
            if glyph_path and os.path.exists(glyph_path):
                st.image(glyph_path, width=80, caption=symbol["uid"])
            else:
                st.markdown("🖼️ *(No glyph)*")
with st.expander("🧠 My Symbolic Memory"):
    mem = st.session_state["memory"]
    st.markdown(f"**Last Viewed:** `{mem['last_viewed']}`")
    st.markdown(f"**Favorites:** {', '.join(mem['favorites']) or 'None'}")
    st.markdown(f"**Viewed Symbols:** {len(mem['viewed'])}")
