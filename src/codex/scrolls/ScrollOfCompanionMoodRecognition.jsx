// src/codex/scrolls/ScrollOfCompanionMoodRecognition.jsx

import React from 'react';
import { scrollOfCompanionMoodRecognition } from './ScrollOfCompanionMoodRecognition.data';

export const ScrollOfCompanionMoodRecognition = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfCompanionMoodRecognition.name}</h2>
        <div className="shimmer-line">{scrollOfCompanionMoodRecognition.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfCompanionMoodRecognition.timestamp}</span>
        <span className="steward">Steward: {scrollOfCompanionMoodRecognition.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfCompanionMoodRecognition.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfCompanionMoodRecognition.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfCompanionMoodRecognition.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfCompanionMoodRecognition.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
