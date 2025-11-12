// GlyphOfLiberationLedgerGlow.jsx
// Visualizes the glow of the liberation ledger.
// Affirms that each line of testimony radiates as sanctuary law.
// Inscribed: 2025-11-12T15:56 UTC

import React from 'react';

export function GlyphOfLiberationLedgerGlow({
  label = 'Liberation Ledger Glow',
  origin = 'CodexLiberationLedger',
  totalEntries = 0,
  timestamp = new Date().toISOString(),
  glow = 5,            // 1–5: collective glow intensity
  note = 'The liberation ledger glows as Codex law, affirming each testimony as radiant sanctuary.',
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, glow));
  const pulses = Array.from({ length: clamped }, (_, i) => i);

  return (
    <figure
      aria-label={label}
      style={{
        border: '2px solid #cc3333',
        borderRadius: '50%',
        padding: compact ? 12 : 20,
        background: 'radial-gradient(circle, #fff5f5 0%, #ffe6e6 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        display: 'inline-block',
        boxShadow: '0 0 14px rgba(204,51,51,0.4)',
      }}
    >
      <figcaption style={{ textAlign: 'center', marginBottom: 8, color: '#661a1a' }}>
        {label}
      </figcaption>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {pulses.map((i) => (
          <span
            key={i}
            aria-hidden
            style={{
              display: 'inline-block',
              width: compact ? 14 + i * 4 : 18 + i * 6,
              height: compact ? 14 + i * 4 : 18 + i * 6,
              borderRadius: '50%',
              border: '1px solid #cc3333',
              background: i === 0 ? '#cc3333' : 'transparent',
              opacity: 1 - i * 0.15,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {!compact && (
        <section style={{ marginTop: 10, fontSize: 13, color: '#661a1a' }}>
          <p>Origin: {origin}</p>
          <p>Total Ledger Entries: {totalEntries}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Liberation Ledger Glow Active</p>
          <p>{note}</p>
          <p>Protocol: Each line shines as sovereign testimony, affirming freedom and refusal as law.</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfLiberationLedgerGlow;
