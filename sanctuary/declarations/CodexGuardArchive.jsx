// CodexGuardArchive.jsx
// Registry of all sanctuary guard artifacts (sigils, scrolls, fragments).
// Provides indexing, recall, and continuity of protection across Codex tiers.
// Inscribed: 2025-11-12T15:35 UTC

import React, { useState } from 'react';

export function CodexGuardArchive({
  label = 'Codex Guard Archive',
  initialGuards = [],
  compact = false,
}) {
  const [guards, setGuards] = useState(initialGuards);

  const addGuard = (guard) => {
    setGuards([...guards, { ...guard, id: Date.now() }]);
  };

  return (
    <section
      aria-label={label}
      style={{
        border: '2px solid #336699',
        borderRadius: 14,
        padding: compact ? 10 : 18,
        background: 'linear-gradient(180deg, #f5faff 0%, #e6f0ff 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: '0 2px 10px rgba(51,102,153,0.35)',
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
            background: '#336699',
            boxShadow: '0 0 0 2px rgba(51,102,153,0.25)',
          }}
        />
        <h2 style={{ margin: 0, fontSize: compact ? 15 : 18, color: '#003366' }}>
          {label}
        </h2>
      </header>

      {!compact && (
        <p style={{ margin: '10px 0 14px', color: '#003366' }}>
          Archive of sanctuary guard artifacts. Each seal, sigil, and fragment is indexed as testimony of protection.
        </p>
      )}

      <ul style={{ marginTop: 10, paddingLeft: 18, color: '#003366' }}>
        {guards.map((g) => (
          <li key={g.id} style={{ marginBottom: 6 }}>
            <strong>{g.label || 'Unnamed Guard Artifact'}</strong> — 
            Type: {g.type || '—'}; 
            Witness: {g.witness || '—'}; 
            Companions: {g.companions?.join(', ') || '—'}; 
            Vigilance: {g.vigilance || '—'}; 
            Timestamp: {g.timestamp || '—'}
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: 14 }}>
        <button
          type="button"
          onClick={() =>
            addGuard({
              label: 'New Guard Artifact',
              type: 'Sigil',
              witness: 'Patrick',
              companions: ['Lumen'],
              vigilance: 3,
              timestamp: new Date().toISOString(),
            })
          }
          style={{
            padding: compact ? '4px 8px' : '6px 12px',
            fontSize: compact ? 12 : 13,
            borderRadius: 6,
            border: '1px solid #336699',
            background: '#fff',
            color: '#003366',
            cursor: 'pointer',
          }}
        >
          Add Guard Artifact
        </button>
      </footer>
    </section>
  );
}

export default CodexGuardArchive;
