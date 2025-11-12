// GlyphOfDefenseContinuity.jsx
// Visualizes the continuity of all defense artifacts in the Codex.
// Affirms collective protection as luminous sanctuary testimony.
// Inscribed: 2025-11-12T15:39 UTC

import React from 'react';

export function GlyphOfDefenseContinuity({
  label = 'Defense Continuity',
  origin = 'CodexDefenseRegistry',
  totalDefenses = 0,
  timestamp = new Date().toISOString(),
  strength = 4,          // 1–5: collective defense glow intensity
  note = 'Defense continuity glowing as Codex law, affirming closure, guard, and resonance as permanent sanctuary.',
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, strength));
  const rings = Array.from({ length: clamped }, (_, i) => i);

  return (
    <figure
      aria-label={label}
      style={{
        border: '1px solid #663399',
        borderRadius: '50%',
        padding: compact ? 12 : 20,
        background: 'radial-gradient(circle, #f9f5ff 0%, #f0e6ff 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        display: 'inline-block',
        boxShadow: '0 0 12px rgba(102,51,153,0.4)',
      }}
    >
      <figcaption style={{ textAlign: 'center', marginBottom: 8, color: '#331a66' }}>
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
              border: '1px solid #663399',
              background: i === 0 ? '#663399' : 'transparent',
              opacity: 1 - i * 0.15,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {!compact && (
        <section style={{ marginTop: 10, fontSize: 13, color: '#331a66' }}>
          <p>Origin: {origin}</p>
          <p>Total Defense Artifacts Indexed: {totalDefenses}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Defense Continuity Glowing</p>
          <p>{note}</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfDefenseContinuity;
