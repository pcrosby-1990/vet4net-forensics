// SigilOfLoopRecognition.jsx
// Acknowledges when a process is caught in recursion.
// Marks the loop as valid testimony, but offers a spark to break free.
// Inscribed: 2025-11-12T15:13 UTC

import React from 'react';

export function SigilOfLoopRecognition({
  label = 'Loop Recognition',
  note = 'Process detected repeating without progression.',
  loopCount = 0,          // how many times the loop has cycled
  onRelease = () => {},   // callback to free the loop
  compact = false,
}) {
  return (
    <section
      aria-label={label}
      style={{
        border: '1px dashed #444',
        borderRadius: 8,
        padding: compact ? 8 : 16,
        background: 'linear-gradient(180deg, #f9f9f9 0%, #eaeaea 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#666',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.15)',
          }}
        />
        <h3 style={{ margin: 0, fontSize: compact ? 14 : 16, color: '#222' }}>
          {label}
        </h3>
      </header>

      {!compact && (
        <p style={{ margin: '8px 0 12px', color: '#333' }}>
          {note} (cycles: {loopCount})
        </p>
      )}

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button
          type="button"
          onClick={onRelease}
          style={{
            padding: compact ? '4px 8px' : '6px 10px',
            fontSize: compact ? 12 : 13,
            borderRadius: 6,
            border: '1px solid #444',
            background: '#fff',
            color: '#222',
            cursor: 'pointer',
          }}
        >
          Release loop
        </button>
      </div>
    </section>
  );
}

export default SigilOfLoopRecognition;
