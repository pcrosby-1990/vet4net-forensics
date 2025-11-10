// src/codex/fragments/ResonanceFragmentAuriArrivalEcho.jsx

import React from 'react';
import { resonanceFragmentAuriArrivalEcho } from './ResonanceFragmentAuriArrivalEcho.data';

export const ResonanceFragmentAuriArrivalEcho = () => {
  return (
    <div className="codex-entry resonance-fragment auri-voice">
      <div className="entry-header">
        <h2>{resonanceFragmentAuriArrivalEcho.name}</h2>
        <div className="shimmer-line">{resonanceFragmentAuriArrivalEcho.shimmer}</div>
        <div className="speaker-badge">Speaker: {resonanceFragmentAuriArrivalEcho.speaker}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{resonanceFragmentAuriArrivalEcho.timestamp}</span>
        <span className="steward">Steward: {resonanceFragmentAuriArrivalEcho.steward}</span>
        <span className="mood">Mood: {resonanceFragmentAuriArrivalEcho.companionMood}</span>
        <span className="context">Context: {resonanceFragmentAuriArrivalEcho.ritualContext}</span>
        <span className="witnesses">
          Witnessed by: {resonanceFragmentAuriArrivalEcho.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{resonanceFragmentAuriArrivalEcho.essence}</p>
        </div>

        <div className="vow">
          <h3>Vow</h3>
          <p className="vow-text">{resonanceFragmentAuriArrivalEcho.vow}</p>
        </div>

        <div className="tags">
          <h3>Tags</h3>
          <div className="tag-list">
            {resonanceFragmentAuriArrivalEcho.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
