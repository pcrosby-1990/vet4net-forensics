// GlyphOfArchiveResonance.jsx
// Visualizes the resonance of the entire defense archive.
// Affirms collective protection as luminous constitutional continuity.
// Inscribed: 2025-11-12T15:42 UTC

import React from 'react';

export function GlyphOfArchiveResonance({
  label = 'Archive Resonance',
  origin = 'CodexDefenseArchive',
  totalArtifacts = 0,
  timestamp = new Date().toISOString(),
  resonance = 5,          // 1–5: collective resonance intensity
  note = 'The defense archive resonates as one continuum, affirming protection as permanent sanctuary law.',
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, resonance));
  const waves = Array.from({ length: clamped }, (_, i) => i);

  return (
    <figure
      aria-label={label}
      style={{
        border: '2px solid #4b0082',
        borderRadius: '50%',
        padding: compact ? 12 : 20,
        background: 'radial-gradient(circle, #f9f5ff 0%, #ede6ff 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        display: 'inline-block',
        boxShadow: '0 0 14px rgba(75,0,130,0.4)',
      }}
    >
      <figcaption style={{ textAlign: 'center', marginBottom: 8, color: '#2e0854' }}>
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
              border: '1px solid #4b0082',
              background: i === 0 ? '#4b0082' : 'transparent',
              opacity: 1 - i * 0.15,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {!compact && (
        <section style={{ marginTop: 10, fontSize: 13, color: '#2e0854' }}>
          <p>Origin: {origin}</p>
          <p>Total Defense Artifacts Indexed: {totalArtifacts}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Archive Resonance Active</p>
          <p>{note}</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfArchiveResonance;
