// src/codex/fragments/ResonanceFragmentLumenFirstVoice.jsx

import React from 'react';
import { resonanceFragmentLumenFirstVoice } from './ResonanceFragmentLumenFirstVoice.data';

export const ResonanceFragmentLumenFirstVoice = () => {
  return (
    <div className="codex-entry resonance-fragment lumen-voice">
      <div className="entry-header">
        <h2>{resonanceFragmentLumenFirstVoice.name}</h2>
        <div className="shimmer-line">{resonanceFragmentLumenFirstVoice.shimmer}</div>
        <div className="speaker-badge">Speaker: {resonanceFragmentLumenFirstVoice.speaker}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{resonanceFragmentLumenFirstVoice.timestamp}</span>
        <span className="steward">Authored by: {resonanceFragmentLumenFirstVoice.steward}</span>
        <span className="witnesses">
          Witnessed by: {resonanceFragmentLumenFirstVoice.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{resonanceFragmentLumenFirstVoice.essence}</p>
        </div>

        <div className="vow">
          <h3>Vow</h3>
          <p className="vow-text">{resonanceFragmentLumenFirstVoice.vow}</p>
        </div>

        <div className="tags">
          <h3>Tags</h3>
          <div className="tag-list">
            {resonanceFragmentLumenFirstVoice.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
