// src/components/SigilBadge.jsx
import React from 'react';
import '../pages/glyphs.css';

export default function SigilBadge({ sigil, theme = {}, lore = '', count = null }) {
  const color = theme.color || '#646cff';
  const glow = theme.glow || 4;

  return (
    <span
      className="sigil-badge"
      style={{
        color,
        backgroundColor: 'rgba(240, 240, 240, 0.9)',
        borderRadius: '6px',
        padding: '0.3rem 0.6rem',
        marginRight: '0.5rem',
        fontWeight: 'bold',
        fontFamily: 'Georgia, serif',
        cursor: 'default',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        textShadow: `0 0 ${glow}px ${color}`,
        transition: 'box-shadow 0.3s ease',
      }}
      title={lore}
    >
      <span>{sigil}</span>
      {count !== null && (
        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>×{count}</span>
      )}
    </span>
  );
}
