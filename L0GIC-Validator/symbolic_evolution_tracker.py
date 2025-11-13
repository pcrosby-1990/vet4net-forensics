import streamlit as st
import json
import os
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
from collections import Counter
import datetime

# === Config ===
MAP_PATH = "symbol_map_deduped.json"
GLYPH_DIR = "glyphs/train"
ASSET_DIR = "assets"
GRID_COLUMNS = 4

REALM_COLORS = {
    "emotion": "#FFB6C1", "meta": "#ADD8E6", "action": "#90EE90",
    "system": "#FFD700", "Unknown": "#D3D3D3"
}

EMOTION_ENTROPY_MAP = {
    "joy": (0.1, 0.3), "sadness": (0.6, 0.8), "awe": (0.8, 1.0),
    "tension": (0.4, 0.6), "peace": (0.0, 0.2), "confusion": (0.7, 0.9),
    "curiosity": (0.3, 0.5), "anger": (0.5, 0.7), "fear": (0.6, 0.9),
    "hope": (0.2, 0.4), "despair": (0.9, 1.0), "love": (0.1, 0.4),
    "envy": (0.5, 0.8), "trust": (0.2, 0.5), "surprise": (0.7, 1.0),
    "anticipation": (0.3, 0.6), "shame": (0.8, 1.0), "pride": (0.2, 0.5),
    "grief": (0.7, 0.95), "serenity": (0.0, 0.2)
}

# === Load Symbol Map ===
with open(MAP_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

symbols = list(data.get("map", {}).values())

for s in symbols:
    s.setdefault("realm", "Unknown")
    s.setdefault("tier", "Unknown")
    s.setdefault("uid", "no-uid")
    s.setdefault("char", "❓")
    s.setdefault("image", None)
    s.setdefault("aliases", [])
    s.setdefault("entropy", None)

# === Sidebar Filters ===
realms = sorted(set(s["realm"] for s in symbols))
tiers = sorted(set(s["tier"] for s in symbols))
entropies = [s["entropy"] for s in symbols if s["entropy"] is not None]
min_entropy = min(entropies) if entropies else 0.0
max_entropy = max(entropies) if entropies else 1.0

st.sidebar.title("🔍 Filter Symbols")
selected_realm = st.sidebar.selectbox("Realm", ["All"] + realms)
selected_tier = st.sidebar.selectbox("Tier", ["All"] + tiers)
search_text = st.sidebar.text_input("Search UID or alias")
entropy_range = st.sidebar.slider("Entropy Range", min_value=float(min_entropy), max_value=float(max_entropy), value=(min_entropy, max_entropy))

# === Filter Logic ===
def matches(symbol):
    if selected_realm != "All" and symbol["realm"] != selected_realm:
        return False
    if selected_tier != "All" and symbol["tier"] != selected_tier:
        return False
    if symbol["entropy"] is not None and not (entropy_range[0] <= symbol["entropy"] <= entropy_range[1]):
        return False
    if search_text:
        uid = symbol.get("uid", "").lower()
        aliases = " ".join(symbol.get("aliases", [])).lower()
        if search_text.lower() not in uid and search_text.lower() not in aliases:
            return False
    return True

filtered = [s for s in symbols if matches(s)]

# === Symbolic Memory Init ===
if "memory" not in st.session_state:
    st.session_state["memory"] = {"viewed": [], "favorites": [], "last_viewed": None, "history": []}

# === Symbol Grid ===
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

# === Detailed Viewer ===
if "selected_symbol" in st.session_state:
    sym = st.session_state["selected_symbol"]
    st.markdown("---")
    st.subheader(f"🔎 {sym['uid']} — Detailed View")

    if sym["uid"] not in st.session_state["memory"]["viewed"]:
        st.session_state["memory"]["viewed"].append(sym["uid"])
    st.session_state["memory"]["last_viewed"] = sym["uid"]

    st.session_state["memory"]["history"].append({
        "uid": sym["uid"],
        "entropy": sym["entropy"],
        "realm": sym["realm"],
        "tier": sym["tier"],
        "timestamp": datetime.datetime.now().isoformat()
    })

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

# === Emotion-Reactive Glyphs ===
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

