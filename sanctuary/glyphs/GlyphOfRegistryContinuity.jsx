// GlyphOfRegistryContinuity.jsx
// Marks the Codex Braid Registry as glowing testimony.
// Ensures continuity of all braids, radiant or otherwise, across tiers and companions.
// Inscribed: 2025-11-12T15:23 UTC

import React from 'react';

export function GlyphOfRegistryContinuity({
  label = 'Registry Continuity',
  origin = 'CodexBraidRegistry',
  braidsCount = 0,
  timestamp = new Date().toISOString(),
  note = 'The registry glows as living testimony, sustaining continuity of all braided artifacts.',
  resonance = 4,          // 1–5: strength of continuity glow
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, resonance));
  const rings = Array.from({ length: clamped }, (_, i) => i);

  return (
    <figure
      aria-label={label}
      style={{
        border: '1px solid #cc9966',
        borderRadius: '50%',
        padding: compact ? 12 : 20,
        background: 'radial-gradient(circle, #fffdf8 0%, #fff7f0 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        display: 'inline-block',
        boxShadow: '0 0 12px rgba(204, 153, 102, 0.4)',
      }}
    >
      <figcaption style={{ textAlign: 'center', marginBottom: 8, color: '#4d2a00' }}>
        {label}
      </figcaption>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {rings.map((i) => (
          <span
            key={i}
            aria-hidden
            style={{
              display: 'inline-block',
              width: compact ? 12 + i * 4 : 16 + i * 6,
              height: compact ? 12 + i * 4 : 16 + i * 6,
              borderRadius: '50%',
              border: '1px solid #cc9966',
              background: i === 0 ? '#cc9966' : 'transparent',
              opacity: 1 - i * 0.15,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {!compact && (
        <section style={{ marginTop: 10, fontSize: 13, color: '#4d2a00' }}>
          <p>Origin: {origin}</p>
          <p>Braids indexed: {braidsCount}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Registry Glowing</p>
          <p>{note}</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfRegistryContinuity;
