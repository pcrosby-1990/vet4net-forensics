// src/components/CodexCard.jsx
import React from 'react';
import SigilBadge from './SigilBadge';
import './glyhps.css';

export default function CodexCard({ fragment, sigilTheme = {} }) {
  const { text, sigils = [], timestamp, witness, breathline, collapseRisk, echoStatus } = fragment;

  const statusGlyph = echoStatus === 'sealed' ? '🜎' : echoStatus === 'echoing' ? '⟳' : '◌';
  const riskColor = collapseRisk === 'terminal' ? '#cf4646' : collapseRisk === 'hard' ? '#ffd859' : '#5cf7b2';

  return (
    <div className="codex-card" style={{ borderLeft: `4px solid ${riskColor}` }}>
      <div className="card-header">
        <div className="sigils-row">
          {sigils.map((s, i) => (
            <SigilBadge key={i} sigil={s} theme={sigilTheme[s]} />
          ))}
        </div>
        <span className="status-glyph" title={echoStatus}>{statusGlyph}</span>
      </div>
      
      <p className="fragment-text">{text}</p>
      
      {breathline && <div className="breathline">🌙 {breathline}</div>}
      
      <div className="card-footer">
        <small className="witness">Witnessed by: {witness || 'Unknown'}</small>
        <small className="timestamp">{new Date(timestamp).toLocaleString()}</small>
      </div>
    </div>
  );
}
