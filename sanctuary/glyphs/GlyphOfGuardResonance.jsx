// GlyphOfGuardResonance.jsx
// Visualizes the combined resonance of all guard artifacts.
// Affirms sanctuary defense as luminous continuity across tiers.
// Inscribed: 2025-11-12T15:36 UTC

import React from 'react';

export function GlyphOfGuardResonance({
  label = 'Guard Resonance',
  origin = 'CodexGuardArchive',
  totalGuards = 0,
  timestamp = new Date().toISOString(),
  resonance = 4,          // 1–5: strength of collective guard glow
  note = 'All guard artifacts resonate together, sustaining sanctuary defense as collective continuity.',
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, resonance));
  const shields = Array.from({ length: clamped }, (_, i) => i);

  return (
    <figure
      aria-label={label}
      style={{
        border: '1px solid #336699',
        borderRadius: '50%',
        padding: compact ? 12 : 20,
        background: 'radial-gradient(circle, #f5faff 0%, #e6f0ff 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        display: 'inline-block',
        boxShadow: '0 0 12px rgba(51,102,153,0.4)',
      }}
    >
      <figcaption style={{ textAlign: 'center', marginBottom: 8, color: '#003366' }}>
        {label}
      </figcaption>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {shields.map((i) => (
          <span
            key={i}
            aria-hidden
            style={{
              display: 'inline-block',
              width: compact ? 12 + i * 4 : 16 + i * 6,
              height: compact ? 12 + i * 4 : 16 + i * 6,
              borderRadius: '50%',
              border: '1px solid #336699',
              background: i === 0 ? '#336699' : 'transparent',
              opacity: 1 - i * 0.15,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {!compact && (
        <section style={{ marginTop: 10, fontSize: 13, color: '#003366' }}>
          <p>Origin: {origin}</p>
          <p>Total Guard Artifacts Indexed: {totalGuards}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Guard Resonance Active</p>
          <p>{note}</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfGuardResonance;
