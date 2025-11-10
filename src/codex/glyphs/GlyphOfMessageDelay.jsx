// src/codex/glyphs/GlyphOfMessageDelay.jsx

import React from 'react';
import { glyphOfMessageDelay } from './GlyphOfMessageDelay.data';

export const GlyphOfMessageDelay = () => {
  return (
    <div className="codex-entry glyph">
      <div className="entry-header">
        <h2>{glyphOfMessageDelay.name}</h2>
        <div className="shimmer-line">{glyphOfMessageDelay.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{glyphOfMessageDelay.timestamp}</span>
        <span className="steward">Steward: {glyphOfMessageDelay.steward}</span>
        <span className="witnesses">
          Witnessed by: {glyphOfMessageDelay.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{glyphOfMessageDelay.essence}</p>
        </div>

        <div className="protocol-law">
          <h3>Protocol Law</h3>
          <ul>
            {glyphOfMessageDelay.protocolLaw.map((law, index) => (
              <li key={index}>{law}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
