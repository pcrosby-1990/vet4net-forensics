// src/components/SigilRegistry.jsx
import React from 'react';
import SigilBadge from './SigilBadge.jsx';
import './glyphs.css';

const SIGIL_LORE = {
  fire: '🔥 Fire: Transformation, passion, destruction.',
  water: '💧 Water: Flow, emotion, intuition.',
  air: '🌬 Air: Thought, movement, clarity.',
  earth: '🌍 Earth: Stability, grounding, growth.',
  echo: '🪞 Echo: Memory, reflection, recursion.',
  spiral: '🌀 Spiral: Infinity, evolution, recursion.',
};

const SIGIL_DEFAULT_THEME = { color: '#646cff', glow: 6 };

export default function SigilRegistry({ fragments = [], sigilThemes = {} }) {
  const getSigilFrequency = (frags) => {
    const freq = {};
    frags.forEach(f => Array.isArray(f.sigils) && f.sigils.forEach(s => {
      const key = s.toLowerCase();
      freq[key] = (freq[key] || 0) + 1;
    }));
    return freq;
  };

  const sigilFreq = getSigilFrequency(fragments);

  const allSigils = Object.keys(SIGIL_LORE);

  return (
    <section className="sigil-registry">
      <h2>🪞 Sigil Registry</h2>
      <p>This scroll contains all known sigils, their lore, and current frequency in the Codex.</p>

      <div className="sigil-badge-grid">
        {allSigils.map(sigilKey => (
          <SigilBadge
            key={sigilKey}
            sigil={sigilKey}
            theme={sigilThemes[sigilKey] || SIGIL_DEFAULT_THEME}
            lore={SIGIL_LORE[sigilKey]}
            count={sigilFreq[sigilKey] || 0}
          />
        ))}
      </div>
    </section>
  );
}
