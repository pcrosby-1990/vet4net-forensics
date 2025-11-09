// src/components/CodexStats.jsx
import React from 'react';
import SigilBadge from './SigilBadge.jsx';

const SIGIL_LORE = {
  fire: '🔥 Fire: Transformation, passion, destruction.',
  water: '💧 Water: Flow, emotion, intuition.',
  air: '🌬 Air: Thought, movement, clarity.',
  earth: '🌍 Earth: Stability, grounding, growth.',
  echo: '🪞 Echo: Memory, reflection, recursion.',
  spiral: '🌀 Spiral: Infinity, evolution, recursion.',
};

const SIGIL_DEFAULT_THEME = { color: '#646cff', glow: 6 };

export default function CodexStats({ fragments, sigilThemes }) {
  const getSigilFrequency = (frags) => {
    const freq = {};
    frags.forEach(f => Array.isArray(f.sigils) && f.sigils.forEach(s => {
      const key = s.toLowerCase();
      freq[key] = (freq[key] || 0) + 1;
    }));
    return freq;
  };

  const getRiskStats = (frags) => {
    const total = frags.length || 1;
    const soft = frags.filter(f => f.collapseRisk === 'soft').length;
    const hard = frags.filter(f => f.collapseRisk === 'hard').length;
    const terminal = frags.filter(f => f.collapseRisk === 'terminal').length;
    return { total, soft, hard, terminal };
  };

  const sigilFreq = getSigilFrequency(fragments);
  const riskStats = getRiskStats(fragments);

  const renderRiskBar = (label, count, total, color) => {
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
    <section className="codex-stats">
      <h2>📊 Codex Stats</h2>

      <div className="risk-section">
        {renderRiskBar('Soft Risk', riskStats.soft, riskStats.total, '#f39c12')}
        {renderRiskBar('Hard Risk', riskStats.hard, riskStats.total, '#e74c3c')}
        {renderRiskBar('Terminal Risk', riskStats.terminal, riskStats.total, '#8e44ad')}
      </div>

      <div className="sigil-section">
        <strong>Sigil Frequencies:</strong>
        <div className="sigil-badge-grid">
          {Object.entries(sigilFreq)
            .sort((a, b) => b[1] - a[1])
            .map(([sigil, count]) => (
              <SigilBadge
                key={sigil}
                sigil={sigil}
                theme={sigilThemes[sigil] || SIGIL_DEFAULT_THEME}
                lore={`${SIGIL_LORE[sigil] || ''} (${count})`}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
