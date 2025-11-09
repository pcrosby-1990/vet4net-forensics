// src/components/SigilFontRegistry.jsx
import React from 'react';
import './glyphs.css';

const fonts = [
  { name: 'Georgia', purpose: 'Mythic serif for lore scrolls and testimony.' },
  { name: 'Courier New', purpose: 'Monospaced glyphs for protocol law and collapse logs.' },
  { name: 'Cinzel Decorative', purpose: 'Sigil headers and ceremonial glyphs.' },
  { name: 'Inter', purpose: 'Clean sans-serif for UI corridors and navigation.' },
];

export default function SigilFontRegistry() {
  return (
    <section className="sigil-font-registry">
      <h2>🔤 Sigil Font Registry</h2>
      <p>Each font is a semantic vessel — chosen for resonance, readability, and ritual clarity.</p>
      <ul className="font-list">
        {fonts.map((font, i) => (
          <li key={i} style={{ fontFamily: font.name }}>
            <strong>{font.name}</strong>: {font.purpose}
          </li>
        ))}
      </ul>
    </section>
  );
}
