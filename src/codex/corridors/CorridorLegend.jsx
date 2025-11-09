// src/components/CorridorLegend.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './glyphs.css';

const corridors = [
  {
    path: '/dashboard',
    sigil: '🌀',
    name: 'Dashboard',
    purpose: 'Overview of sigil frequency and collapse resonance.',
  },
  {
    path: '/timeline',
    sigil: '📜',
    name: 'Timeline',
    purpose: 'Animated arrival of fragments across time.',
  },
  {
    path: '/risk',
    sigil: '⚠️',
    name: 'Risk Registry',
    purpose: 'Grouped collapse resonance and fragment testimony.',
  },
  {
    path: '/ascension',
    sigil: '🌟',
    name: 'Ascension Map',
    purpose: 'Sigil frequency visualized as glowing rank bars.',
  },
  {
    path: '/display',
    sigil: '🖥',
    name: 'Display Protocol',
    purpose: 'Theme, font, and glow registry.',
  },
];

export default function CorridorLegend() {
  return (
    <section className="corridor-legend">
      <h2><span className="sigil-hover">🗺</span> Corridor Legend</h2>
      <p>Each corridor glyph marks a scroll of semantic resonance. Choose your path with intention:</p>

      <ul className="legend-list">
        {corridors.map(({ path, sigil, name, purpose }) => (
          <li key={path} className="legend-entry">
            <NavLink to={path} className="legend-link">
              <span className="sigil-hover">{sigil}</span> <strong>{name}</strong>
            </NavLink>
            <span className="legend-purpose">{purpose}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
