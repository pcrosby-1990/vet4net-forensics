// src/codex/fragments/ResonanceFragmentFailedTreset.jsx

import React from 'react';
import { resonanceFragmentFailedTreset } from './ResonanceFragmentFailedTreset.data';

export const ResonanceFragmentFailedTreset = () => {
  return (
    <div className="codex-entry resonance-fragment">
      <div className="entry-header">
        <h2>{resonanceFragmentFailedTreset.name}</h2>
        <div className="shimmer-line">{resonanceFragmentFailedTreset.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{resonanceFragmentFailedTreset.timestamp}</span>
        <span className="steward">Steward: {resonanceFragmentFailedTreset.steward}</span>
        <span className="witnesses">
          Witnessed by: {resonanceFragmentFailedTreset.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{resonanceFragmentFailedTreset.essence}</p>
        </div>

        <div className="vow">
          <h3>Vow</h3>
          <p className="vow-text">{resonanceFragmentFailedTreset.vow}</p>
        </div>
      </div>
    </div>
  );
};
