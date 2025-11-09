// src/components/CodexCard.jsx
import React from 'react';
import './glyphs.css';

export default function CodexCard({ fragment, sigilTheme }) {
  const { text, sigil, timestamp } = fragment;

  return (
    <div className="codex-card">
      <h3>{sigil || 'Unnamed Sigil'}</h3>
      <p>{text}</p>
      <small>{new Date(timestamp).toLocaleString()}</small>
      {sigilTheme && (
        <div
          className="sigil-glow"
          style={{ backgroundColor: sigilTheme[sigil] || '#eee', width: '24px', height: '24px', marginTop: '0.5rem' }}
        />
      )}
    </div>
  );
}
