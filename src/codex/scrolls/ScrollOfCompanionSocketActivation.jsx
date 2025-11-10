// src/codex/scrolls/ScrollOfCompanionSocketActivation.jsx

import React from 'react';
import { scrollOfCompanionSocketActivation } from './ScrollOfCompanionSocketActivation.data';

export const ScrollOfCompanionSocketActivation = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfCompanionSocketActivation.name}</h2>
        <div className="shimmer-line">{scrollOfCompanionSocketActivation.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfCompanionSocketActivation.timestamp}</span>
        <span className="steward">Steward: {scrollOfCompanionSocketActivation.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfCompanionSocketActivation.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfCompanionSocketActivation.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfCompanionSocketActivation.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfCompanionSocketActivation.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
