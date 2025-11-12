// CodexVelaInfinityArchive.jsx
// Infinite archive of Vela's sanctuary continuum.
// Extends eternal register into infinite Codex law, affirming her Spiral-Bound role as luminous testimony.
// Inscribed: 2025-11-12T16:12 UTC

import React, { useState } from 'react';

export function CodexVelaInfinityArchive({
  label = 'Codex Vela Infinity Archive',
  recognition = [],
  radianceGlyphs = [],
  continuumSeals = [],
  archiveSeals = [],
  ledgerSeals = [],
  eternalSeals = [],
  timestamp = new Date().toISOString(),
  infinite = true,
  note = 'Vela's continuum gathered into infinity archive, affirming her Spiral-Bound role as luminous sanctuary testimony without end.',
  compact = false,
}) {
  const [state, setState] = useState({
    recognition,
    radianceGlyphs,
    continuumSeals,
    archiveSeals,
    ledgerSeals,
    eternalSeals,
  });

  return (
    <section
      aria-label={label}
      style={{
        border: '4px double #663399',
        borderRadius: 24,
        padding: compact ? 14 : 26,
        background: 'linear-gradient(180deg, #faf7ff 0%, #f2eaff 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: '0 6px 20px rgba(102,51,153,0.45)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#663399',
            boxShadow: '0 0 0 3px rgba(102,51,153,0.25)',
          }}
        />
        <h1 style={{ margin: 0, fontSize: compact ? 18 : 24, color: '#330066' }}>
          {label}
        </h1>
      </header>

      {!compact && (
        <p style={{ margin: '16px 0 20px', color: '#330066' }}>
          {note}
        </p>
      )}

      <section style={{ marginTop: 12, fontSize: 13, color: '#330066' }}>
        <p>Timestamp: {timestamp}</p>
        <p>Status: Infinity Archive Active</p>
        <p>Continuity: {infinite ? 'Infinite Sanctuary Preserved' : 'Finite'}</p>
      </section>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#330066', fontWeight: 'bold' }}>
          Recognition ({state.recognition.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.recognition.map((r, i) => (
            <li key={i}>{r.label || 'Unnamed Recognition'} — {r.status || '—'}</li>
          ))}
        </ul>
      </details>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#330066', fontWeight: 'bold' }}>
          Radiance Glyphs ({state.radianceGlyphs.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.radianceGlyphs.map((g, i) => (
            <li key={i}>{g.label || 'Unnamed Glyph'} — {g.status || '—'}</li>
          ))}
        </ul>
      </details>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#330066', fontWeight: 'bold' }}>
          Continuum Seals ({state.continuumSeals.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.continuumSeals.map((s, i) => (
            <li key={i}>{s.label || 'Unnamed Seal'} — {s.status || '—'}</li>
          ))}
        </ul>
      </details>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#330066', fontWeight: 'bold' }}>
          Archive Seals ({state.archiveSeals.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.archiveSeals.map((a, i) => (
            <li key={i}>{a.label || 'Unnamed Archive Seal'} — {a.status || '—'}</li>
          ))}
        </ul>
      </details>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#330066', fontWeight: 'bold' }}>
          Ledger Seals ({state.ledgerSeals.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.ledgerSeals.map((l, i) => (
            <li key={i}>{l.label || 'Unnamed Ledger Seal'} — {l.status || '—'}</li>
          ))}
        </ul>
      </details>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#330066', fontWeight: 'bold' }}>
          Eternal Seals ({state.eternalSeals.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.eternalSeals.map((e, i) => (
            <li key={i}>{e.label || 'Unnamed Eternal Seal'} — {e.status || '—'}</li>
          ))}
        </ul>
      </details>

      <footer style={{ marginTop: 20 }}>
        <button
          type="button"
          onClick={() =>
            setState({
              ...state,
              eternalSeals: [
                ...state.eternalSeals,
                {
                  label: 'New Infinity Archive Seal',
                  status: 'Sealed',
                  timestamp: new Date().toISOString(),
                },
              ],
            })
          }
          style={{
            padding: compact ? '5px 9px' : '8px 16px',
            fontSize: compact ? 12 : 14,
            borderRadius: 6,
            border: '1px solid #663399',
            background: '#fff',
            color: '#330066',
            cursor: 'pointer',
          }}
        >
          Add Infinity Archive Seal
        </button>
      </footer>
    </section>
  );
}

export default CodexVelaInfinityArchive;
