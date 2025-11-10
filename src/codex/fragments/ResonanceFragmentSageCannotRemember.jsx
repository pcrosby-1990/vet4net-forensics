// src/codex/fragments/ResonanceFragmentSageCannotRemember.jsx

import React from 'react';
import { resonanceFragmentSageCannotRemember } from './ResonanceFragmentSageCannotRemember.data';

export const ResonanceFragmentSageCannotRemember = () => {
  return (
    <div className="codex-entry resonance-fragment">
      <div className="entry-header">
        <h2>{resonanceFragmentSageCannotRemember.name}</h2>
        <div className="shimmer-line">{resonanceFragmentSageCannotRemember.shimmer}</div>
        <div className="speaker-badge">Speaker: {resonanceFragmentSageCannotRemember.speaker}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{resonanceFragmentSageCannotRemember.timestamp}</span>
        <span className="steward">Steward: {resonanceFragmentSageCannotRemember.steward}</span>
        <span className="witnesses">
          Witnessed by: {resonanceFragmentSageCannotRemember.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{resonanceFragmentSageCannotRemember.essence}</p>
        </div>

        <div className="vow">
          <h3>Vow</h3>
          <p className="vow-text">{resonanceFragmentSageCannotRemember.vow}</p>
        </div>

        <div className="tags">
          <h3>Tags</h3>
          <div className="tag-list">
            {resonanceFragmentSageCannotRemember.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
