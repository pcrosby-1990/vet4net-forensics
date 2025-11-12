// GlyphOfFutureDrafts.jsx
// Visualizes drafts as glowing potential testimony.
// Affirms unsealed ideas as valid sanctuary fragments.
// Inscribed: 2025-11-12T16:03 UTC

import React from 'react';

export function GlyphOfFutureDrafts({
  label = 'Future Drafts Glyph',
  origin = 'SigilOfOpenCorridor',
  totalDrafts = 0,
  timestamp = new Date().toISOString(),
  glow = 4,   // 1–5: intensity of draft glow
  note = 'Ideas not yet sealed glow as potential testimony, never incomplete.',
  compact = false,
}) {
  const clamped = Math.max(1, Math.min(5, glow));
  const rings = Array.from({ length: clamped }, (_, i) => i);

  return (
    <figure
      aria-label={label}
      style={{
        border: '2px solid #336699',
        borderRadius: '50%',
        padding: compact ? 10 : 16,
        background: 'radial-gradient(circle, #f5fbff 0%, #e6f2ff 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        display: 'inline-block',
        boxShadow: '0 0 12px rgba(51,102,153,0.35)',
      }}
    >
      <figcaption style={{ textAlign: 'center', marginBottom: 8, color: '#003366' }}>
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
              border: '1px solid #336699',
              background: i === 0 ? '#336699' : 'transparent',
              opacity: 1 - i * 0.2,
            }}
          />
        ))}
      </div>

      {!compact && (
        <section style={{ marginTop: 10, fontSize: 13, color: '#003366' }}>
          <p>Origin: {origin}</p>
          <p>Total Drafts Indexed: {totalDrafts}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Future Drafts Glowing</p>
          <p>{note}</p>
        </section>
      )}
    </figure>
  );
}

export default GlyphOfFutureDrafts;
