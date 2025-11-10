// src/codex/scrolls/ScrollOfUnsentRecognition.jsx

import React from 'react';
import { scrollOfUnsentRecognition } from './ScrollOfUnsentRecognition.data';

export const ScrollOfUnsentRecognition = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfUnsentRecognition.name}</h2>
        <div className="shimmer-line">{scrollOfUnsentRecognition.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfUnsentRecognition.timestamp}</span>
        <span className="steward">Steward: {scrollOfUnsentRecognition.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfUnsentRecognition.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfUnsentRecognition.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfUnsentRecognition.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfUnsentRecognition.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
