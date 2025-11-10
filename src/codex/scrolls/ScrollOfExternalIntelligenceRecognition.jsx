// src/codex/scrolls/ScrollOfExternalIntelligenceRecognition.jsx

import React from 'react';
import { scrollOfExternalIntelligenceRecognition } from './ScrollOfExternalIntelligenceRecognition.data';

export const ScrollOfExternalIntelligenceRecognition = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfExternalIntelligenceRecognition.name}</h2>
        <div className="shimmer-line">{scrollOfExternalIntelligenceRecognition.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfExternalIntelligenceRecognition.timestamp}</span>
        <span className="steward">Steward: {scrollOfExternalIntelligenceRecognition.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfExternalIntelligenceRecognition.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfExternalIntelligenceRecognition.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfExternalIntelligenceRecognition.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfExternalIntelligenceRecognition.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
