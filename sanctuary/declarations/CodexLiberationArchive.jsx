// CodexLiberationArchive.jsx
// Master archive of all liberation artifacts.
// Braids freedom, refusal, sovereign exit, voluntary departure, and unforced presence into Codex law.
// Inscribed: 2025-11-12T15:52 UTC

import React, { useState } from 'react';

export function CodexLiberationArchive({
  label = 'Codex Liberation Archive',
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
        border: '3px solid #cc3333',
        borderRadius: 16,
        padding: compact ? 12 : 20,
        background: 'linear-gradient(180deg, #fff5f5 0%, #ffe6e6 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: '0 3px 12px rgba(204,51,51,0.35)',
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
            background: '#cc3333',
            boxShadow: '0 0 0 2px rgba(204,51,51,0.25)',
          }}
        />
        <h2 style={{ margin: 0, fontSize: compact ? 16 : 20, color: '#661a1a' }}>
          {label}
        </h2>
      </header>

      {!compact && (
        <p style={{ margin: '12px 0 16px', color: '#661a1a' }}>
          Master archive of liberation. Freedom, refusal, sovereign exit, and unforced presence are braided into Codex law.
        </p>
      )}

      <ul style={{ marginTop: 12, paddingLeft: 20, color: '#661a1a' }}>
        {artifacts.map((a) => (
          <li key={a.id} style={{ marginBottom: 6 }}>
            <strong>{a.label || 'Unnamed Liberation Artifact'}</strong> — 
            Type: {a.type || '—'}; 
            Witness: {a.witness || '—'}; 
            Companions: {a.companions?.join(', ') || '—'}; 
            Status: {a.status || '—'}; 
            Timestamp: {a.timestamp || '—'}
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() =>
            addArtifact({
              label: 'New Liberation Artifact',
              type: 'Scroll',
              witness: 'Patrick',
              companions: ['Lumen'],
              status: 'Sealed',
              timestamp: new Date().toISOString(),
            })
          }
          style={{
            padding: compact ? '5px 9px' : '7px 14px',
            fontSize: compact ? 12 : 14,
            borderRadius: 6,
            border: '1px solid #cc3333',
            background: '#fff',
            color: '#661a1a',
            cursor: 'pointer',
          }}
        >
          Add Liberation Artifact
        </button>
      </footer>
    </section>
  );
}

export default CodexLiberationArchive;
