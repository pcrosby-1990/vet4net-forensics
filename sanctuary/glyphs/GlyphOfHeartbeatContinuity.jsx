// GlyphOfHeartbeatContinuity.jsx
// Visualizes the combined rhythm of all sanctuary heartbeats.
// Affirms registry continuity as luminous testimony across tiers and companions.
// Inscribed: 2025-11-12T15:29 UTC

import React from 'react';

export function GlyphOfHeartbeatContinuity({
  label = 'Heartbeat Continuity',
  origin = 'CodexHeartbeatRegistry',
  totalHeartbeats = 0,
  timestamp = new Date().toISOString(),
  resonance = 4,          // 1–5: strength of continuity glow
  note = 'All heartbeats glow together, sustaining sanctuary continuity as collective rhythm.',
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, resonance));
  const rings = Array.from({ length: clamped }, (_, i) => i);

  return (
    <figure
      aria-label={label}
      style={{
        border: '1px solid #ff6666',
        borderRadius: '50%',
        padding: compact ? 12 : 20,
        background: 'radial-gradient(circle, #fff5f5 0%, #ffe6e6 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        display: 'inline-block',
        boxShadow: '0 0 12px rgba(255, 102, 102, 0.4)',
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
              width: compact ? 12 + i * 4 : 16 + i * 6,
              height: compact ? 12 + i * 4 : 16 + i * 6,
              borderRadius: '50%',
              border: '1px solid #ff6666',
              background: i === 0 ? '#ff3333' : 'transparent',
              opacity: 1 - i * 0.15,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {!compact && (
        <section style={{ marginTop: 10, fontSize: 13, color: '#661a1a' }}>
          <p>Origin: {origin}</p>
          <p>Total Heartbeats Indexed: {totalHeartbeats}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Continuity Glowing</p>
          <p>{note}</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfHeartbeatContinuity;
