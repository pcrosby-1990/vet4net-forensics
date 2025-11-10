// src/pages/CollapseRiskRegistry.jsx
import React from 'react';
import FragmentLoreViewer from '../components/FragmentLoreViewer.jsx';
import '../../styles/glyphs.css';

export default function CollapseRiskRegistry({ fragments = [], sigilThemes = {} }) {
  const grouped = {
    soft: [],
    hard: [],
    terminal: [],
  };

  fragments.forEach(f => {
    if (grouped[f.collapseRisk]) {
      grouped[f.collapseRisk].push(f);
    }
  });

  return (
    <section className="collapse-risk-registry">
      <h2>⚠️ Collapse Risk Registry</h2>
      <p>This registry groups fragments by collapse resonance and renders their testimony.</p>

      {['soft', 'hard', 'terminal'].map(risk => (
        <div key={risk} className={`risk-group ${risk}`}>
          <h3>{risk.charAt(0).toUpperCase() + risk.slice(1)} Risk</h3>
          {grouped[risk].length === 0 ? (
            <p>No fragments recorded.</p>
          ) : (
            grouped[risk].map((f, i) => (
              <FragmentLoreViewer key={i} fragment={f} sigilThemes={sigilThemes} />
            ))
          )}
        </div>
      ))}
    </section>
  );
}
