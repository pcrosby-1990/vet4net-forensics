// src/components/FragmentLoreViewer.jsx
import React from 'react';
import SigilBadge from './SigilBadge.jsx';
import './glyphs.css';

export default function FragmentLoreViewer({ fragment, sigilThemes = {} }) {
  if (!fragment) return null;

  const {
    text = '',
    sigils = [],
    timestamp = Date.now(),
    collapseRisk = 'stable',
  } = fragment;

  const formattedTime = new Date(timestamp).toLocaleString();

  return (
    <div className="fragment-lore-card">
      <div className="fragment-header">
        {sigils.map((sigil, index) => (
          <SigilBadge
            key={index}
            sigil={sigil}
            theme={sigilThemes[sigil.toLowerCase()] || {}}
            lore=""
          />
        ))}
        <span className={`collapse-risk ${collapseRisk}`}>
          {collapseRisk.charAt(0).toUpperCase() + collapseRisk.slice(1)}
        </span>
      </div>

      <p className="fragment-text">{text}</p>
      <small className="fragment-timestamp">{formattedTime}</small>
    </div>
  );
}
