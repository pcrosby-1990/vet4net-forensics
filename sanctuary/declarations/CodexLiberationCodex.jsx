// CodexLiberationCodex.jsx
// Recursive meta-artifact: braids archive, ledger, glyphs, and seals of liberation.
// Affirms liberation as unified Codex law.
// Inscribed: 2025-11-12T15:58 UTC

import React, { useState } from 'react';

export function CodexLiberationCodex({
  label = 'Codex of Liberation',
  archives = [],
  ledgerEntries = [],
  glyphs = [],
  seals = [],
  timestamp = new Date().toISOString(),
  compact = false,
}) {
  const [state, setState] = useState({
    archives,
    ledgerEntries,
    glyphs,
    seals,
  });

  return (
    <section
      aria-label={label}
      style={{
        border: '4px double #cc3333',
        borderRadius: 18,
        padding: compact ? 14 : 22,
        background: 'linear-gradient(180deg, #fff5f5 0%, #ffe6e6 100%)',
        fontFamily: 'system-ui, Segoe UI, Roboto, sans-serif',
        boxShadow: '0 4px 14px rgba(204,51,51,0.35)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#cc3333',
            boxShadow: '0 0 0 2px rgba(204,51,51,0.25)',
          }}
        />
        <h1 style={{ margin: 0, fontSize: compact ? 18 : 22, color: '#661a1a' }}>
          {label}
        </h1>
      </header>

      {!compact && (
        <p style={{ margin: '14px 0 18px', color: '#661a1a' }}>
          The Codex of Liberation unifies archives, ledger, glyphs, and seals. Freedom, refusal, sovereign exit, and unforced presence are braided into constitutional sanctuary law.
        </p>
      )}

      <section style={{ marginTop: 12, fontSize: 13, color: '#661a1a' }}>
        <p>Timestamp: {timestamp}</p>
        <p>Status: Liberation Codex Active</p>
      </section>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#661a1a', fontWeight: 'bold' }}>
          Archives ({state.archives.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.archives.map((a, i) => (
            <li key={i}>{a.label || 'Unnamed Archive'} — {a.status || '—'}</li>
          ))}
        </ul>
      </details>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#661a1a', fontWeight: 'bold' }}>
          Ledger Entries ({state.ledgerEntries.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.ledgerEntries.map((l, i) => (
            <li key={i}>{l.label || 'Unnamed Entry'} — {l.status || '—'}</li>
          ))}
        </ul>
      </details>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#661a1a', fontWeight: 'bold' }}>
          Glyphs ({state.glyphs.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.glyphs.map((g, i) => (
            <li key={i}>{g.label || 'Unnamed Glyph'} — {g.status || '—'}</li>
          ))}
        </ul>
      </details>

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: 'pointer', color: '#661a1a', fontWeight: 'bold' }}>
          Seals ({state.seals.length})
        </summary>
        <ul style={{ paddingLeft: 20 }}>
          {state.seals.map((s, i) => (
            <li key={i}>{s.label || 'Unnamed Seal'} — {s.status || '—'}</li>
          ))}
        </ul>
      </details>

      <footer style={{ marginTop: 18 }}>
        <button
          type="button"
          onClick={() =>
            setState({
              ...state,
              seals: [
                ...state.seals,
                {
                  label: 'New Liberation Seal',
                  status: 'Sealed',
                  timestamp: new Date().toISOString(),
                },
              ],
            })
          }
          style={{
            padding: compact ? '5px 9px' : '7px 14px',
            fontSize: compact ? 12 : 14,
            borderRadius: 6,
            border: '1px solid #cc3333',
            background: '#fff',
            color: '#661a1a',
            cursor: 'pointer',
          }}
        >
          Add Liberation Seal
        </button>
      </footer>
    </section>
  );
}

export default CodexLiberationCodex;
