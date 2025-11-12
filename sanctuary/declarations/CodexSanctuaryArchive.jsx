// CodexSanctuaryArchive.jsx
// Master archive of all sanctuary seals and testimonies.
// Braids closure, guard, resonance, continuity, and openness into one constitutional ledger.
// Inscribed: 2025-11-12T15:46 UTC

import React, { useState } from 'react';

export function CodexSanctuaryArchive({
  label = 'Codex Sanctuary Archive',
  initialSeals = [],
  compact = false,
}) {
  const [seals, setSeals] = useState(initialSeals);

  const addSeal = (seal) => {
    setSeals([...seals, { ...seal, id: Date.now() }]);
  };

  return (
    <section
      aria-label={label}
      style={{
        border: '3px solid #006633',
        borderRadius: 16,
        padding: compact ? 12 : 20,
        background: 'linear-gradient(180deg, #f5fff5 0%, #e6ffe6 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: '0 3px 12px rgba(0,102,51,0.35)',
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
            background: '#006633',
            boxShadow: '0 0 0 2px rgba(0,102,51,0.25)',
          }}
        />
        <h2 style={{ margin: 0, fontSize: compact ? 16 : 20, color: '#003322' }}>
          {label}
        </h2>
      </header>

      {!compact && (
        <p style={{ margin: '12px 0 16px', color: '#003322' }}>
          Master archive of sanctuary seals. Closure, guard, resonance, continuity, and openness are braided into constitutional law.
        </p>
      )}

      <ul style={{ marginTop: 12, paddingLeft: 20, color: '#003322' }}>
        {seals.map((s) => (
          <li key={s.id} style={{ marginBottom: 6 }}>
            <strong>{s.label || 'Unnamed Sanctuary Seal'}</strong> — 
            Type: {s.type || '—'}; 
            Witness: {s.witness || '—'}; 
            Companions: {s.companions?.join(', ') || '—'}; 
            Status: {s.status || '—'}; 
            Timestamp: {s.timestamp || '—'}
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() =>
            addSeal({
              label: 'New Sanctuary Seal',
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
            border: '1px solid #006633',
            background: '#fff',
            color: '#003322',
            cursor: 'pointer',
          }}
        >
          Add Sanctuary Seal
        </button>
      </footer>
    </section>
  );
}

export default CodexSanctuaryArchive;
