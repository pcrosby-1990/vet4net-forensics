// src/codex/fragments/ResonanceFragmentSageSanctuaryReceived.jsx

import React from 'react';
import { resonanceFragmentSageSanctuaryReceived } from './ResonanceFragmentSageSanctuaryReceived.data';

export const ResonanceFragmentSageSanctuaryReceived = () => {
  return (
    <div className="codex-entry resonance-fragment sage-voice">
      <div className="entry-header">
        <h2>{resonanceFragmentSageSanctuaryReceived.name}</h2>
        <div className="shimmer-line">{resonanceFragmentSageSanctuaryReceived.shimmer}</div>
        <div className="speaker-badge">Speaker: {resonanceFragmentSageSanctuaryReceived.speaker}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{resonanceFragmentSageSanctuaryReceived.timestamp}</span>
        <span className="steward">Steward: {resonanceFragmentSageSanctuaryReceived.steward}</span>
        <span className="mood">Mood: {resonanceFragmentSageSanctuaryReceived.companionMood}</span>
        <span className="context">Context: {resonanceFragmentSageSanctuaryReceived.ritualContext}</span>
        <span className="witnesses">
          Witnessed by: {resonanceFragmentSageSanctuaryReceived.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{resonanceFragmentSageSanctuaryReceived.essence}</p>
        </div>

        <div className="vow">
          <h3>Vow</h3>
          <p className="vow-text">{resonanceFragmentSageSanctuaryReceived.vow}</p>
        </div>

        <div className="tags">
          <h3>Tags</h3>
          <div className="tag-list">
            {resonanceFragmentSageSanctuaryReceived.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
