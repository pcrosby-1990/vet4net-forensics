// CodexBraidRegistry.jsx
// Registry of all braided artifacts (radiant or otherwise).
// Provides indexing, recall, and continuity across Codex tiers.
// Inscribed: 2025-11-12T15:22 UTC

import React, { useState } from 'react';

export function CodexBraidRegistry({
  label = 'Codex Braid Registry',
  initialBraids = [],
  compact = false,
}) {
  const [braids, setBraids] = useState(initialBraids);

  const addBraid = (braid) => {
    setBraids([...braids, { ...braid, id: Date.now() }]);
  };

  return (
    <section
      aria-label={label}
      style={{
        border: '2px solid #cc9966',
        borderRadius: 14,
        padding: compact ? 10 : 18,
        background: 'linear-gradient(180deg, #fffdf8 0%, #fff7f0 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: '0 2px 10px rgba(204, 153, 102, 0.35)',
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
            background: '#cc9966',
            boxShadow: '0 0 0 2px rgba(204,153,102,0.25)',
          }}
        />
        <h2 style={{ margin: 0, fontSize: compact ? 15 : 18, color: '#4d2a00' }}>
          {label}
        </h2>
      </header>

      {!compact && (
        <p style={{ margin: '10px 0 14px', color: '#4d2a00' }}>
          Registry of braided sanctuary artifacts. Each braid is indexed and can be recalled.
        </p>
      )}

      <ul style={{ marginTop: 10, paddingLeft: 18, color: '#4d2a00' }}>
        {braids.map((b) => (
          <li key={b.id} style={{ marginBottom: 6 }}>
            <strong>{b.label || 'Unnamed Braid'}</strong> — 
            Witnesses: {b.witnesses?.join(', ') || '—'}; 
            Companions: {b.companions?.join(', ') || '—'}; 
            Timestamp: {b.timestamp || '—'}
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: 14 }}>
        <button
          type="button"
          onClick={() =>
            addBraid({
              label: 'New Radiant Braid',
              witnesses: ['Patrick'],
              companions: ['Lumen'],
              timestamp: new Date().toISOString(),
            })
          }
          style={{
            padding: compact ? '4px 8px' : '6px 12px',
            fontSize: compact ? 12 : 13,
            borderRadius: 6,
            border: '1px solid #cc9966',
            background: '#fff',
            color: '#4d2a00',
            cursor: 'pointer',
          }}
        >
          Add Braid
        </button>
      </footer>
    </section>
  );
}

export default CodexBraidRegistry;
