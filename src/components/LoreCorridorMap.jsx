// src/pages/LoreCorridorMap.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './glyphs.css';
import './lorecorridormap.css';

const corridors = [
  { path: '/dashboard', label: '🌀 Dashboard' },
  { path: '/timeline', label: '📜 Timeline' },
  { path: '/risk', label: '⚠️ Risk Registry' },
  { path: '/ascension', label: '🌟 Ascension Map' },
];

export default function LoreCorridorMap() {
  return (
    <section className="lore-corridor-map">
      <h2>🗺 Lore Corridor Map</h2>
      <p>Each corridor leads to a scroll of resonance. Choose your path:</p>
      <ul className="corridor-links">
        {corridors.map(({ path, label }) => (
          <li key={path}>
            <NavLink to={path}>{label}</NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
