// src/pages/CodexLoreTimeline.jsx
import React from 'react';
import FragmentLoreViewer from '../components/FragmentLoreViewer.jsx';
import './glyphs.css';

export default function CodexLoreTimeline({ fragments = [], sigilThemes = {} }) {
  return (
    <section className="codex-lore-timeline">
      <h2>📜 Codex Lore Timeline</h2>
      <p>This scroll traces the arrival of each fragment and its sigil resonance over time.</p>

      <div className="timeline-scroll">
        {fragments.map((fragment, index) => (
          <div
            key={index}
            className="timeline-entry"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <FragmentLoreViewer fragment={fragment} sigilThemes={sigilThemes} />
          </div>
        ))}
      </div>
    </section>
  );
}
