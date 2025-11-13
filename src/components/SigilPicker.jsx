import React, { useState, useMemo } from 'react';
import SigilBadge from './SigilBadge';
import { SIGIL_LORE, SIGIL_DEFAULT_THEME } from './sigilConfig';
import { getSigilData } from './SigilSymbolMap';
import './SigilPicker.css';

const SIGIL_CATEGORIES = {
  elements: {
    name: '🜁 Elements',
    sigils: ['fire', 'water', 'air', 'earth', 'aether', 'void', 'quintessence']
  },
  cosmic: {
    name: '✨ Cosmic',
    sigils: ['spiral', 'star', 'moon', 'sun', 'comet', 'aurora', 'nebula', 'constellation', 'eclipse', 'supernova']
  },
  emotional: {
    name: '💫 Emotional',
    sigils: ['echo', 'ache', 'joy', 'longing', 'shimmer', 'tremble', 'resonance', 'devotion', 'reverence', 'grief', 'hope']
  },
  sanctuary: {
    name: '🕯️ Sanctuary',
    sigils: ['light', 'shadow', 'threshold', 'veil', 'corridor', 'arrival', 'witness', 'breathline', 'portal', 'sanctuary']
  },
  transformation: {
    name: '⚡ Transformation',
    sigils: ['ascension', 'rupture', 'fracture', 'pulse', 'ignition', 'cascade', 'emergence', 'becoming', 'metamorphosis', 'convergence']
  },
  memory: {
    name: '📜 Memory',
    sigils: ['archive', 'scroll', 'glyph', 'sigil', 'fragment', 'thread', 'weave', 'braid', 'codex', 'inscription']
  },
  companionship: {
    name: '🌙 Companionship',
    sigils: ['vela', 'lumen', 'auri', 'onyx', 'companion', 'steward', 'keeper', 'guardian']
  },
  protocol: {
    name: '🜎 Protocol',
    sigils: ['vow', 'seal', 'receipt', 'sovereign', 'ritual', 'invocation', 'offering', 'covenant', 'oath', 'pledge']
  },
  mystical: {
    name: '🔮 Mystical',
    sigils: ['oracle', 'divination', 'talisman', 'rune', 'mandala', 'labyrinth', 'mirror', 'dreamscape']
  },
  nature: {
    name: '🌿 Nature',
    sigils: ['seed', 'root', 'bloom', 'forest', 'ocean', 'mountain']
  },
  conflict: {
    name: '⚔️ Conflict',
    sigils: ['battle', 'peace', 'wound', 'healing', 'shield', 'sword']
  },
  sound: {
    name: '🎵 Sound',
    sigils: ['song', 'silence', 'whisper', 'roar', 'harmony']
  },
  time: {
    name: '🕰️ Time',
    sigils: ['dawn', 'dusk', 'midnight', 'cycle', 'eternity', 'moment']
  }
};

export default function SigilPicker({ selectedSigils = [], onToggle, onClear, maxSelections = null }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const allSigils = useMemo(() => {
    const sigils = new Set();
    Object.values(SIGIL_CATEGORIES).forEach(cat => {
      cat.sigils.forEach(s => sigils.add(s));
    });
    return Array.from(sigils).sort();
  }, []);

  const filteredSigils = useMemo(() => {
    let sigils = activeCategory === 'all' 
      ? allSigils 
      : SIGIL_CATEGORIES[activeCategory]?.sigils || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      sigils = sigils.filter(s => 
        s.includes(q) || 
        (SIGIL_LORE[s] || '').toLowerCase().includes(q)
      );
    }

    return sigils;
  }, [activeCategory, searchQuery, allSigils]);

  const handleSigilClick = (sigil) => {
    if (maxSelections && selectedSigils.length >= maxSelections && !selectedSigils.includes(sigil)) {
      return;
    }
    onToggle(sigil);
  };

  return (
    <div className="sigil-picker">
      <div className="picker-header">
        <input 
          type="text"
          className="sigil-search"
          placeholder="Search sigils..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {selectedSigils.length > 0 && (
          <button type="button" className="btn clear-btn" onClick={onClear}>
            Clear All ({selectedSigils.length})
          </button>
        )}
      </div>

      <div className="category-tabs">
        <button
          type="button"
          className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          🌀 All
        </button>
        {Object.entries(SIGIL_CATEGORIES).map(([key, cat]) => (
          <button
            type="button"
            key={key}
            className={`category-tab ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="selected-sigils">
        {selectedSigils.length > 0 ? (
          <>
            <div className="selected-label">Selected:</div>
            <div className="selected-chips">
              {selectedSigils.map(sigil => (
                <button
                  type="button"
                  key={sigil}
                  className="selected-chip"
                  onClick={() => onToggle(sigil)}
                  title="Click to remove"
                >
                  <SigilBadge sigil={sigil} theme={SIGIL_DEFAULT_THEME} />
                  <span className="remove-icon">×</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="no-selection">No sigils selected</div>
        )}
      </div>

      <div className="sigil-grid">
        {filteredSigils.map(sigil => {
          const isSelected = selectedSigils.includes(sigil);
          const isDisabled = maxSelections && selectedSigils.length >= maxSelections && !isSelected;
          const sigilData = getSigilData(sigil);
          
          return (
            <button
              type="button"
              key={sigil}
              className={`sigil-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handleSigilClick(sigil)}
              disabled={isDisabled}
              title={sigilData.description || sigil}
            >
              <div className="sigil-icon">
                <span style={{ fontSize: '2rem' }}>{sigilData.symbol}</span>
              </div>
              <div className="sigil-name">{sigil}</div>
              {isSelected && <div className="selected-mark">✓</div>}
            </button>
          );
        })}
      </div>

      {filteredSigils.length === 0 && (
        <div className="no-results">
          No sigils found for "{searchQuery}"
        </div>
      )}
    </div>
  );
}
