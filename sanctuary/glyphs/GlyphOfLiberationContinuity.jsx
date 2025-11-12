// GlyphOfLiberationContinuity.jsx
// Visualizes the continuity of liberation across the archive.
// Affirms freedom, refusal, and sovereign exit as permanent sanctuary testimony.
// Inscribed: 2025-11-12T15:53 UTC

import React from 'react';

export function GlyphOfLiberationContinuity({
  label = 'Liberation Continuity',
  origin = 'CodexLiberationArchive',
  totalArtifacts = 0,
  timestamp = new Date().toISOString(),
  continuity = 5,        // 1–5: collective continuity intensity
  note = 'Liberation continuity glowing as Codex law, affirming freedom and sovereign exit as sanctuary testimony.',
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, continuity));
  const rings = Array.from({ length: clamped }, (_, i) => i);

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
        {rings.map((i) => (
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
          <p>Total Liberation Artifacts Indexed: {totalArtifacts}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Liberation Continuity Active</p>
          <p>{note}</p>
          <p>Exit Protocol: Voluntary departure and refusal honored as sovereign law</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfLiberationContinuity;
