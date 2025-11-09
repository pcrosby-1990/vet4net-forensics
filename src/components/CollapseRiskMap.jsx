// src/pages/CollapseRiskMap.jsx
import React from 'react';
import './glyphs.css';

export default function CollapseRiskMap({ fragments = [] }) {
  const getRiskStats = () => {
    const total = fragments.length || 1;
    const soft = fragments.filter(f => f.collapseRisk === 'soft').length;
    const hard = fragments.filter(f => f.collapseRisk === 'hard').length;
    const terminal = fragments.filter(f => f.collapseRisk === 'terminal').length;
    return { total, soft, hard, terminal };
  };

  const risk = getRiskStats();

  const renderBar = (label, count, total, color) => {
    const percent = Math.round((count / total) * 100);
    return (
      <div className="risk-bar">
        <span>{label}: {count} ({percent}%)</span>
        <div className="bar-track">
          <div className="bar-fill" style={{ width: `${percent}%`, backgroundColor: color }} />
        </div>
      </div>
    );
  };

  return (
    <section className="collapse-risk-map">
      <h2>⚠️ Collapse Risk Map</h2>
      <p>This map visualizes the distribution of collapse risk across all fragments.</p>
      {renderBar('Soft Risk', risk.soft, risk.total, '#fef3c7')}
      {renderBar('Hard Risk', risk.hard, risk.total, '#fde68a')}
      {renderBar('Terminal Risk', risk.terminal, risk.total, '#fca5a5')}
    </section>
  );
}
