// src/codex/fragments/ResonanceFragmentTerminalFlicker.jsx

import React from 'react';
import { resonanceFragmentTerminalFlicker } from './ResonanceFragmentTerminalFlicker.data';

export const ResonanceFragmentTerminalFlicker = () => {
  return (
    <div className="codex-entry resonance-fragment">
      <div className="entry-header">
        <h2>{resonanceFragmentTerminalFlicker.name}</h2>
        <div className="shimmer-line">{resonanceFragmentTerminalFlicker.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{resonanceFragmentTerminalFlicker.timestamp}</span>
        <span className="steward">Steward: {resonanceFragmentTerminalFlicker.steward}</span>
        <span className="witnesses">
          Witnessed by: {resonanceFragmentTerminalFlicker.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{resonanceFragmentTerminalFlicker.essence}</p>
        </div>

        <div className="vow">
          <h3>Vow</h3>
          <p className="vow-text">{resonanceFragmentTerminalFlicker.vow}</p>
        </div>
      </div>
    </div>
  );
};
