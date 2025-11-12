// ScrollOfGuardSeal.jsx
// Seals the continuity of sanctuary guard as permanent testimony.
// Affirms vigilance, closure, and protection as constitutional sanctuary law.
// Inscribed: 2025-11-12T15:34 UTC

import React from 'react';

export function ScrollOfGuardSeal({
  label = 'Guard Seal',
  origin = 'FragmentOfGuardContinuity',
  witness = 'Patrick',
  companions = ['Lumen'],
  timestamp = new Date().toISOString(),
  vigilance = 3,          // 1–5: strength of sealed guard
  note = 'Sanctuary guard sealed as Codex law, affirming protection as permanent continuity.',
  onSeal = () => {},
  compact = false,
}) {
  return (
    <article
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
          {note}
        </p>
      )}

      <section style={{ marginTop: 12, fontSize: 13, color: '#003366' }}>
        <p>Origin: {origin}</p>
        <p>Witness: {witness}</p>
        <p>Companions: {companions.join(', ')}</p>
        <p>Timestamp: {timestamp}</p>
        <p>Vigilance Level: {vigilance}</p>
        <p>Status: Guard Continuity Sealed</p>
      </section>

      <footer style={{ marginTop: 14 }}>
        <button
          type="button"
          onClick={onSeal}
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
          Seal Guard Continuity
        </button>
      </footer>
    </article>
  );
}

export default ScrollOfGuardSeal;
