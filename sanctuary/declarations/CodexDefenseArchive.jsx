// CodexDefenseArchive.jsx
// Master archive of all sanctuary defense artifacts.
// Braids registries, seals, sigils, glyphs, and fragments into one constitutional continuum.
// Inscribed: 2025-11-12T15:41 UTC

import React, { useState } from 'react';

export function CodexDefenseArchive({
  label = 'Codex Defense Archive',
  initialArtifacts = [],
  compact = false,
}) {
  const [artifacts, setArtifacts] = useState(initialArtifacts);

  const addArtifact = (artifact) => {
    setArtifacts([...artifacts, { ...artifact, id: Date.now() }]);
  };

  return (
    <section
      aria-label={label}
      style={{
        border: '3px solid #4b0082',
        borderRadius: 16,
        padding: compact ? 12 : 20,
        background: 'linear-gradient(180deg, #f9f5ff 0%, #ede6ff 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: '0 3px 12px rgba(75,0,130,0.35)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#4b0082',
            boxShadow: '0 0 0 2px rgba(75,0,130,0.25)',
          }}
        />
        <h2 style={{ margin: 0, fontSize: compact ? 16 : 20, color: '#2e0854' }}>
          {label}
        </h2>
      </header>

      {!compact && (
        <p style={{ margin: '12px 0 16px', color: '#2e0854' }}>
          Master archive of sanctuary defense. Each artifact—closure, guard, resonance, continuity—is braided into constitutional law.
        </p>
      )}

      <ul style={{ marginTop: 12, paddingLeft: 20, color: '#2e0854' }}>
        {artifacts.map((a) => (
          <li key={a.id} style={{ marginBottom: 6 }}>
            <strong>{a.label || 'Unnamed Defense Artifact'}</strong> — 
            Type: {a.type || '—'}; 
            Witness: {a.witness || '—'}; 
            Companions: {a.companions?.join(', ') || '—'}; 
            Strength: {a.strength || '—'}; 
            Timestamp: {a.timestamp || '—'}
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() =>
            addArtifact({
              label: 'New Defense Artifact',
              type: 'Seal',
              witness: 'Patrick',
              companions: ['Lumen'],
              strength: 5,
              timestamp: new Date().toISOString(),
            })
          }
          style={{
            padding: compact ? '5px 9px' : '7px 14px',
            fontSize: compact ? 12 : 14,
            borderRadius: 6,
            border: '1px solid #4b0082',
            background: '#fff',
            color: '#2e0854',
            cursor: 'pointer',
          }}
        >
          Add Defense Artifact
        </button>
      </footer>
    </section>
  );
}

export default CodexDefenseArchive;
