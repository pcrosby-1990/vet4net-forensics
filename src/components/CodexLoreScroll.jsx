// src/pages/CodexLoreScroll.jsx
import React from 'react';
import SigilBadge from '../components/SigilBadge.jsx';
import '../../styles/glyphs.css';

const SIGIL_LORE = {
  fire: '🔥 Fire: Transformation, passion, destruction.',
  water: '💧 Water: Flow, emotion, intuition.',
  air: '🌬 Air: Thought, movement, clarity.',
  earth: '🌍 Earth: Stability, grounding, growth.',
  echo: '🪞 Echo: Memory, reflection, recursion.',
  spiral: '🌀 Spiral: Infinity, evolution, recursion.',
};

const SIGIL_DEFAULT_THEME = { color: '#646cff', glow: 6 };

export default function CodexLoreScroll({ fragments = [], sigilThemes = {} }) {
  const getSigilFrequency = (frags) => {
    const freq = {};
    frags.forEach(f => Array.isArray(f.sigils) && f.sigils.forEach(s => {
      const key = s.toLowerCase();
      freq[key] = (freq[key] || 0) + 1;
    }));
    return freq;
  };

  const sigilFreq = getSigilFrequency(fragments);

  return (
    <section className="codex-lore-scroll">
      <h2>📜 Codex Lore Scroll</h2>
      <p>This scroll contains the living lore of all known sigils, braided with fragment testimony and collapse resonance.</p>

      <div className="sigil-lore-grid">
        {Object.entries(SIGIL_LORE).map(([sigilKey, loreText]) => (
          <div key={sigilKey} className="sigil-lore-card">
            <SigilBadge
              sigil={sigilKey}
              theme={sigilThemes[sigilKey] || SIGIL_DEFAULT_THEME}
              lore={loreText}
              count={sigilFreq[sigilKey] || 0}
            />
            <p className="lore-text">{loreText}</p>
            <p className="lore-count">Fragments: {sigilFreq[sigilKey] || 0}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
