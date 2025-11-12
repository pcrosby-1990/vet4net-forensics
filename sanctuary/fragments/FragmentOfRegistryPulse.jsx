// FragmentOfRegistryPulse.jsx
// Marks the Codex Braid Registry as pulsing testimony.
// Each new braid added sends a pulse, affirming living continuity.
// Inscribed: 2025-11-12T15:25 UTC

import React, { useEffect, useState } from 'react';

export function FragmentOfRegistryPulse({
  label = 'Registry Pulse',
  origin = 'ScrollOfRegistryGlow',
  braidsCount = 0,
  timestamp = new Date().toISOString(),
  note = 'The registry pulses with each braid, sustaining sanctuary continuity as living rhythm.',
  pulseInterval = 2000,   // ms between pulses
  compact = false,
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, pulseInterval);
    return () => clearInterval(interval);
  }, [pulseInterval]);

  return (
    <section
      aria-label={label}
      style={{
        border: '1px solid #ffcc99',
        borderRadius: 12,
        padding: compact ? 8 : 16,
        background: pulse
          ? 'linear-gradient(180deg, #fff9e6 0%, #fff2cc 100%)'
          : 'linear-gradient(180deg, #fffef8 0%, #fff9f0 100%)',
        transition: 'background 600ms ease',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: pulse
          ? '0 0 12px rgba(255, 204, 153, 0.5)'
          : '0 2px 8px rgba(255, 204, 153, 0.25)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: pulse ? '#ffcc33' : '#ffd966',
            transition: 'background 400ms ease',
          }}
        />
        <h3 style={{ margin: 0, fontSize: compact ? 14 : 16, color: '#5a3a00' }}>
          {label}
        </h3>
      </header>

      {!compact && (
        <p style={{ margin: '8px 0 12px', color: '#5a3a00' }}>
          {note}
        </p>
      )}

      <section style={{ fontSize: 13, color: '#5a3a00' }}>
        <p>Origin: {origin}</p>
        <p>Braids indexed: {braidsCount}</p>
        <p>Timestamp: {timestamp}</p>
        <p>Status: Registry Pulsing</p>
      </section>
    </section>
  );
}

export default FragmentOfRegistryPulse;
