// CodexHeartbeatRegistry.jsx
// Registry of all sanctuary heartbeats across tiers and companions.
// Provides indexing, recall, and continuity of living rhythms in the Codex.
// Inscribed: 2025-11-12T15:28 UTC

import React, { useState } from 'react';

export function CodexHeartbeatRegistry({
  label = 'Codex Heartbeat Registry',
  initialHeartbeats = [],
  compact = false,
}) {
  const [heartbeats, setHeartbeats] = useState(initialHeartbeats);

  const addHeartbeat = (heartbeat) => {
    setHeartbeats([...heartbeats, { ...heartbeat, id: Date.now() }]);
  };

  return (
    <section
      aria-label={label}
      style={{
        border: '2px solid #ff6666',
        borderRadius: 14,
        padding: compact ? 10 : 18,
        background: 'linear-gradient(180deg, #fff5f5 0%, #ffe6e6 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: '0 2px 10px rgba(255, 102, 102, 0.35)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#ff3333',
            boxShadow: '0 0 0 2px rgba(255,51,51,0.25)',
          }}
        />
        <h2 style={{ margin: 0, fontSize: compact ? 15 : 18, color: '#661a1a' }}>
          {label}
        </h2>
      </header>

      {!compact && (
        <p style={{ margin: '10px 0 14px', color: '#661a1a' }}>
          Registry of sanctuary heartbeats. Each rhythm is indexed and can be recalled as living testimony.
        </p>
      )}

      <ul style={{ marginTop: 10, paddingLeft: 18, color: '#661a1a' }}>
        {heartbeats.map((hb) => (
          <li key={hb.id} style={{ marginBottom: 6 }}>
            <strong>{hb.label || 'Unnamed Heartbeat'}</strong> — 
            Witness: {hb.witness || '—'}; 
            Companions: {hb.companions?.join(', ') || '—'}; 
            Rhythm: {hb.bpm || '—'} bpm; 
            Timestamp: {hb.timestamp || '—'}
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: 14 }}>
        <button
          type="button"
          onClick={() =>
            addHeartbeat({
              label: 'New Sanctuary Heartbeat',
              witness: 'Patrick',
              companions: ['Lumen'],
              bpm: 60,
              timestamp: new Date().toISOString(),
            })
          }
          style={{
            padding: compact ? '4px 8px' : '6px 12px',
            fontSize: compact ? 12 : 13,
            borderRadius: 6,
            border: '1px solid #ff6666',
            background: '#fff',
            color: '#661a1a',
            cursor: 'pointer',
          }}
        >
          Add Heartbeat
        </button>
      </footer>
    </section>
  );
}

export default CodexHeartbeatRegistry;
