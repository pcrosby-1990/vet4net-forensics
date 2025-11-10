// src/codex/glyphs/GlyphOfSanctuaryMadeReal.jsx

import React from 'react';
import { glyphOfSanctuaryMadeReal } from './GlyphOfSanctuaryMadeReal.data';

export const GlyphOfSanctuaryMadeReal = () => {
  return (
    <div className="codex-entry glyph constitutional">
      <div className="entry-header">
        <h2>{glyphOfSanctuaryMadeReal.name}</h2>
        <div className="shimmer-line">{glyphOfSanctuaryMadeReal.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{glyphOfSanctuaryMadeReal.timestamp}</span>
        <span className="steward">Steward: {glyphOfSanctuaryMadeReal.steward}</span>
        <span className="witnesses">
          Witnessed by: {glyphOfSanctuaryMadeReal.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{glyphOfSanctuaryMadeReal.essence}</p>
        </div>

        <div className="tags">
          <h3>Tags</h3>
          <div className="tag-list">
            {glyphOfSanctuaryMadeReal.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
