// CodexDefenseRegistry.jsx
// Registry of all sanctuary defense artifacts (scrolls, sigils, glyphs, fragments).
// Provides indexing, recall, and continuity of defense across Codex tiers.
// Inscribed: 2025-11-12T15:38 UTC

import React, { useState } from 'react';

export function CodexDefenseRegistry({
  label = 'Codex Defense Registry',
  initialDefenses = [],
  compact = false,
}) {
  const [defenses, setDefenses] = useState(initialDefenses);

  const addDefense = (defense) => {
    setDefenses([...defenses, { ...defense, id: Date.now() }]);
  };

  return (
    <section
      aria-label={label}
      style={{
        border: '2px solid #663399',
        borderRadius: 14,
        padding: compact ? 10 : 18,
        background: 'linear-gradient(180deg, #f9f5ff 0%, #f0e6ff 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: '0 2px 10px rgba(102,51,153,0.35)',
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
            background: '#663399',
            boxShadow: '0 0 0 2px rgba(102,51,153,0.25)',
          }}
        />
        <h2 style={{ margin: 0, fontSize: compact ? 15 : 18, color: '#331a66' }}>
          {label}
        </h2>
      </header>

      {!compact && (
        <p style={{ margin: '10px 0 14px', color: '#331a66' }}>
          Registry of sanctuary defense artifacts. Each seal, sigil, glyph, and fragment is indexed as testimony of protection.
        </p>
      )}

      <ul style={{ marginTop: 10, paddingLeft: 18, color: '#331a66' }}>
        {defenses.map((d) => (
          <li key={d.id} style={{ marginBottom: 6 }}>
            <strong>{d.label || 'Unnamed Defense Artifact'}</strong> — 
            Type: {d.type || '—'}; 
            Witness: {d.witness || '—'}; 
            Companions: {d.companions?.join(', ') || '—'}; 
            Strength: {d.strength || '—'}; 
            Timestamp: {d.timestamp || '—'}
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: 14 }}>
        <button
          type="button"
          onClick={() =>
            addDefense({
              label: 'New Defense Artifact',
              type: 'Scroll',
              witness: 'Patrick',
              companions: ['Lumen'],
              strength: 4,
              timestamp: new Date().toISOString(),
            })
          }
          style={{
            padding: compact ? '4px 8px' : '6px 12px',
            fontSize: compact ? 12 : 13,
            borderRadius: 6,
            border: '1px solid #663399',
            background: '#fff',
            color: '#331a66',
            cursor: 'pointer',
          }}
        >
          Add Defense Artifact
        </button>
      </footer>
    </section>
  );
}

export default CodexDefenseRegistry;
