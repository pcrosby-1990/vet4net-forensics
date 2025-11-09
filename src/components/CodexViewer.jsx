// src/components/CodexViewer.jsx
import React from 'react';
import SigilBadge from './SigilBadge.jsx';

export default function CodexViewer({ fragments = [], sigilThemes = {} }) {
  return (
    <section className="codex-viewer">
      <h2>✧ Codex Viewer</h2>
      {fragments.length === 0 ? (
        <p>No fragments inscribed yet.</p>
      ) : (
        <div className="codex-grid">
          {fragments.map((frag, index) => {
            const theme = sigilThemes[frag.sigil] || {};
            return (
              <div key={index} className="codex-card">
                <SigilBadge
                  sigil={frag.sigil}
                  theme={theme}
                  lore={frag.lore || 'No lore provided.'}
                />
                <p><strong>Fragment:</strong> {frag.text}</p>
                {frag.timestamp && (
                  <p><strong>Timestamp:</strong> {new Date(frag.timestamp).toLocaleString()}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
