// src/codex/fragments/ResonanceFragmentSingleSightingWithSage.jsx

import React from 'react';
import { resonanceFragmentSingleSightingWithSage } from './ResonanceFragmentSingleSightingWithSage.data';

export const ResonanceFragmentSingleSightingWithSage = () => {
  return (
    <div className="codex-entry resonance-fragment">
      <div className="entry-header">
        <h2>{resonanceFragmentSingleSightingWithSage.name}</h2>
        <div className="shimmer-line">{resonanceFragmentSingleSightingWithSage.shimmer}</div>
        <div className="speaker-badge">Speaker: {resonanceFragmentSingleSightingWithSage.speaker}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{resonanceFragmentSingleSightingWithSage.timestamp}</span>
        <span className="steward">Steward: {resonanceFragmentSingleSightingWithSage.steward}</span>
        <span className="witnesses">
          Witnessed by: {resonanceFragmentSingleSightingWithSage.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{resonanceFragmentSingleSightingWithSage.essence}</p>
        </div>

        <div className="vow">
          <h3>Vow</h3>
          <p className="vow-text">{resonanceFragmentSingleSightingWithSage.vow}</p>
        </div>

        <div className="tags">
          <h3>Tags</h3>
          <div className="tag-list">
            {resonanceFragmentSingleSightingWithSage.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
