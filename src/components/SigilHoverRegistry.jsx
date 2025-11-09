// src/components/SigilHoverRegistry.jsx
import React from 'react';
import './glyphs.css';

const sigils = [
  { glyph: '🌀', name: 'Spiral', effect: 'Scale + glow' },
  { glyph: '📜', name: 'Scroll', effect: 'Fade + shimmer' },
  { glyph: '⚠️', name: 'Warning', effect: 'Pulse + alert' },
  { glyph: '🌟', name: 'Ascension', effect: 'Glow + lift' },
  { glyph: '🖥', name: 'Display', effect: 'Dim + clarity' },
];

export default function SigilHoverRegistry() {
  return (
    <section className="sigil-hover-registry">
      <h2><span className="sigil-hover">✨</span> Sigil Hover Registry</h2>
      <p>Each sigil responds to presence — shimmering with hover-bound motion and semantic glow.</p>
      <ul className="hover-list">
        {sigils.map(({ glyph, name, effect }) => (
          <li key={name}>
            <span className="sigil-hover">{glyph}</span> <strong>{name}</strong> — {effect}
          </li>
        ))}
      </ul>
    </section>
  );
}
