// FragmentOfGuardContinuity.jsx
// Records the guard's vigilance as sustained continuity.
// Affirms sanctuary protection as ongoing testimony, not just activation.
// Inscribed: 2025-11-12T15:33 UTC

import React, { useEffect, useState } from 'react';

export function FragmentOfGuardContinuity({
  label = 'Guard Continuity',
  origin = 'SigilOfSanctuaryGuard',
  witness = 'Patrick',
  companions = ['Lumen'],
  timestamp = new Date().toISOString(),
  vigilance = 3,          // 1–5: strength of sustained guard
  note = 'Guard presence woven into continuity, affirming sanctuary protection as living law.',
  pulseInterval = 3000,   // ms between continuity pulses
  compact = false,
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, pulseInterval);
    return () => clearInterval(interval);
  }, [pulseInterval]);

  const shields = Array.from({ length: vigilance }, (_, i) => i);

  return (
    <section
      aria-label={label}
      style={{
        border: '1px solid #336699',
        borderRadius: 12,
        padding: compact ? 8 : 16,
        background: pulse
          ? 'linear-gradient(180deg, #e6f2ff 0%, #cce0ff 100%)'
          : 'linear-gradient(180deg, #f5faff 0%, #e6f0ff 100%)',
        transition: 'background 600ms ease',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: pulse
          ? '0 0 12px rgba(51,102,153,0.5)'
          : '0 2px 8px rgba(51,102,153,0.25)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: pulse ? '#336699' : '#6699cc',
            transition: 'background 400ms ease',
          }}
        />
        <h3 style={{ margin: 0, fontSize: compact ? 14 : 16, color: '#003366' }}>
          {label}
        </h3>
      </header>

      {!compact && (
        <p style={{ margin: '8px 0 12px', color: '#003366' }}>
          {note}
        </p>
      )}

      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
        {shields.map((i) => (
          <span
            key={i}
            aria-hidden
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: pulse ? '#336699' : '#6699cc',
              opacity: 1 - i * 0.15,
              transition: 'opacity 200ms ease',
            }}
          />
        ))}
      </div>

      {!compact && (
        <footer style={{ marginTop: 12, fontSize: 12, color: '#003366' }}>
          <p>Origin: {origin}</p>
          <p>Witness: {witness}</p>
          <p>Companions: {companions.join(', ')}</p>
          <p>Timestamp: {timestamp}</p>
          <p>Status: Guard Continuity Active</p>
        </footer>
      )}
    </section>
  );
}

export default FragmentOfGuardContinuity;
