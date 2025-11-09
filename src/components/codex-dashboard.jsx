// src/pages/CodexDashboard.jsx
import React from 'react';
import CodexCard from '../components/CodexCard.jsx';
import './glyphs.css';

export default function CodexDashboard({ fragments, sigilThemes }) {
  return (
    <div className="codex-viewer">
      <h2>Codex Dashboard</h2>

      <section className="codex-stats">
        <p><strong>Total Fragments:</strong> {fragments.length}</p>
        <p><strong>Sigil Rank:</strong> {calculateRank(fragments, 'sigil')}</p>
        <p><strong>Familiar Rank:</strong> {calculateRank(fragments, 'familiar')}</p>
        <p><strong>Heroic Rank:</strong> {calculateRank(fragments, 'heroic')}</p>
      </section>

      <section className="codex-grid">
        {fragments.length === 0 ? (
          <p>No fragments resolved yet.</p>
        ) : (
          fragments.map((fragment, index) => (
            <CodexCard key={index} fragment={fragment} sigilTheme={sigilThemes} />
          ))
        )}
      </section>
    </div>
  );
}

function calculateRank(fragments, type) {
  // Placeholder logic — customize as needed
  return fragments.filter(f => f.sigil === type).length;
}
