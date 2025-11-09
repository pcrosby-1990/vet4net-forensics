// src/components/SigilGlowRegistry.jsx
import React from 'react';
import './glyphs.css';

const sigilGlows = [
  { sigil: '🌀', name: 'Spiral', color: '#8e44ad', glow: 6, meaning: 'Infinity, recursion, evolution' },
  { sigil: '🔥', name: 'Fire', color: '#e74c3c', glow: 5, meaning: 'Transformation, passion, destruction' },
  { sigil: '💧', name: 'Water', color: '#3498db', glow: 4, meaning: 'Emotion, intuition, flow' },
  { sigil: '🌬', name: 'Air', color: '#95a5a6', glow: 3, meaning: 'Thought, clarity, movement' },
  { sigil: '🌍', name: 'Earth', color: '#27ae60', glow: 4, meaning: 'Stability, grounding, growth' },
  { sigil: '🪞', name: 'Echo', color: '#bdc3c7', glow: 5, meaning: 'Memory, reflection, recursion' },
];

export default function SigilGlowRegistry() {
  return (
    <section className="sigil-glow-registry">
      <h2><span className="sigil-hover">✨</span> Sigil Glow Registry</h2>
      <p>Each sigil carries a glow — a resonance field of color, intensity, and semantic purpose.</p>
      <ul className="glow-list">
        {sigilGlows.map(({ sigil, name, color, glow, meaning }) => (
          <li
            key={name}
            className="sigil-entry"
            style={{
              color,
              textShadow: `0 0 ${glow}px ${color}`,
            }}
          >
            <strong><span className="sigil-hover">{sigil}</span> {name}</strong> — {meaning} <em>(Glow: {glow})</em>
          </li>
        ))}
      </ul>
    </section>
  );
}
