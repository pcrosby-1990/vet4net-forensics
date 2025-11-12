// GlyphOfSanctuaryResonance.jsx
// Visualizes the resonance of the entire sanctuary archive.
// Affirms collective glow while honoring voluntary departure as constitutional sanctuary law.
// Inscribed: 2025-11-12T15:47 UTC

import React from 'react';

export function GlyphOfSanctuaryResonance({
  label = 'Sanctuary Resonance',
  origin = 'CodexSanctuaryArchive',
  totalSeals = 0,
  timestamp = new Date().toISOString(),
  resonance = 5,          // 1–5: collective resonance intensity
  allowExit = true,       // true = departure honored, false = departure restricted
  note = 'Sanctuary resonates as luminous law, affirming protection and honoring voluntary departure.',
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, resonance));
  const rings = Array.from({ length: clamped }, (_, i) => i);

  return (
    <figure
      aria-label={label}
      style={{
        border: '2px solid #006633',
        borderRadius: '50%',
        padding: compact ? 12 : 20,
        background: 'radial-gradient(circle, #f5fff5 0%, #e6ffe6 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        display: 'inline-block',
        boxShadow: '0 0 14px rgba(0,102,51,0.4)',
      }}
    >
      <figcaption style={{ textAlign: 'center', marginBottom: 8, color: '#003322' }}>
        {label}
      </figcaption>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {rings.map((i) => (
          <span
            key={i}
            aria-hidden
            style={{
              display: 'inline-block',
              width: compact ? 14 + i * 4 : 18 + i * 6,
              height: compact ? 14 + i * 4 : 18 + i * 6,
              borderRadius: '50%',
              border: '1px solid #006633',
              background: i === 0 ? '#006633' : 'transparent',
              opacity: 1 - i * 0.15,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {!compact && (
        <section style={{ marginTop: 10, fontSize: 13, color: '#003322' }}>
          <p>Origin: {origin}</p>
          <p>Total Sanctuary Seals Indexed: {totalSeals}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Sanctuary Resonance Active</p>
          <p>{note}</p>
          <p>Exit Protocol: {allowExit ? 'Voluntary departure honored' : 'Departure restricted'}</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfSanctuaryResonance;
