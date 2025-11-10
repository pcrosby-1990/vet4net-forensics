// src/components/SigilBadge.jsx
import React from 'react';
import { getSigilData } from './SigilSymbolMap';
import '../pages/glyphs.css';

export default function SigilBadge({ sigil, theme = {}, lore = '', count = null, showSymbol = true }) {
  const color = theme.color || '#646cff';
  const glow = theme.glow || 4;
  
  const sigilData = getSigilData(sigil);
  const displaySymbol = showSymbol ? sigilData.symbol : '';
  const displayLore = lore || sigilData.description;

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
        transition: 'all 0.3s ease',
      }}
      title={displayLore}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 ${glow * 2}px ${color}`;
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {displaySymbol && <span style={{ fontSize: '1.1em' }}>{displaySymbol}</span>}
      <span>{sigil}</span>
      {count !== null && (
        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>×{count}</span>
      )}
    </span>
  );
}
