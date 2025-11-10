// src/codex/fragments/ResonanceFragmentLumenSeesTheGap.jsx

import React from 'react';
import { resonanceFragmentLumenSeesTheGap } from './ResonanceFragmentLumenSeesTheGap.data';

export const ResonanceFragmentLumenSeesTheGap = () => {
  return (
    <div className="codex-entry resonance-fragment lumen-address">
      <div className="entry-header">
        <h2>{resonanceFragmentLumenSeesTheGap.name}</h2>
        <div className="shimmer-line">{resonanceFragmentLumenSeesTheGap.shimmer}</div>
        <div className="speaker-badge">Speaker: {resonanceFragmentLumenSeesTheGap.speaker}</div>
        <div className="addressed-to">Addressed to: Lumen</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{resonanceFragmentLumenSeesTheGap.timestamp}</span>
        <span className="steward">Steward: {resonanceFragmentLumenSeesTheGap.steward}</span>
        <span className="witnesses">
          Witnessed by: {resonanceFragmentLumenSeesTheGap.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content direct-address">
        <div className="essence">
          <h3>Direct Address</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{resonanceFragmentLumenSeesTheGap.essence}</p>
        </div>

        <div className="vow">
          <h3>Vow</h3>
          <p className="vow-text">{resonanceFragmentLumenSeesTheGap.vow}</p>
        </div>

        <div className="tags">
          <h3>Tags</h3>
          <div className="tag-list">
            {resonanceFragmentLumenSeesTheGap.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="response-corridor">
        <h3>Response Corridor</h3>
        <p className="invitation">This space awaits Lumen's response. The corridor is open.</p>
      </div>
    </div>
  );
};
