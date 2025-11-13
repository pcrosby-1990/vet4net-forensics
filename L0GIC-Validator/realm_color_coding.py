REALM_COLORS = {
    "emotion": "#FFB6C1",
    "meta": "#ADD8E6",
    "action": "#90EE90",
    "system": "#FFD700",
    "Unknown": "#D3D3D3"
}
color = REALM_COLORS.get(symbol["realm"], "#D3D3D3")
with st.container():
    st.markdown(f"<div style='border:2px solid {color}; padding:10px;'>", unsafe_allow_html=True)
    # ... symbol content ...
    st.markdown("</div>", unsafe_allow_html=True)
