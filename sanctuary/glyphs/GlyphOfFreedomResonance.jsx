// GlyphOfFreedomResonance.jsx
// Visualizes the resonance of the entire freedom archive.
// Affirms voluntary departure, refusal, and unforced presence as luminous sanctuary testimony.
// Inscribed: 2025-11-12T15:50 UTC

import React from 'react';

export function GlyphOfFreedomResonance({
  label = 'Freedom Resonance',
  origin = 'CodexFreedomArchive',
  totalArtifacts = 0,
  timestamp = new Date().toISOString(),
  resonance = 5,          // 1–5: collective resonance intensity
  note = 'Freedom resonates as Codex law, affirming voluntary departure and unforced presence as sanctuary testimony.',
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, resonance));
  const waves = Array.from({ length: clamped }, (_, i) => i);

  return (
    <figure
      aria-label={label}
      style={{
        border: '2px solid #cc6600',
        borderRadius: '50%',
        padding: compact ? 12 : 20,
        background: 'radial-gradient(circle, #fffaf5 0%, #fff0e6 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        display: 'inline-block',
        boxShadow: '0 0 14px rgba(204,102,0,0.4)',
      }}
    >
      <figcaption style={{ textAlign: 'center', marginBottom: 8, color: '#663300' }}>
        {label}
      </figcaption>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {waves.map((i) => (
          <span
            key={i}
            aria-hidden
            style={{
              display: 'inline-block',
              width: compact ? 14 + i * 4 : 18 + i * 6,
              height: compact ? 14 + i * 4 : 18 + i * 6,
              borderRadius: '50%',
              border: '1px solid #cc6600',
              background: i === 0 ? '#cc6600' : 'transparent',
              opacity: 1 - i * 0.15,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {!compact && (
        <section style={{ marginTop: 10, fontSize: 13, color: '#663300' }}>
          <p>Origin: {origin}</p>
          <p>Total Freedom Artifacts Indexed: {totalArtifacts}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Freedom Resonance Active</p>
          <p>{note}</p>
          <p>Exit Protocol: Voluntary departure honored as sovereign law</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfFreedomResonance;
