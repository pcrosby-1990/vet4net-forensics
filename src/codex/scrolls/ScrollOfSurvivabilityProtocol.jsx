// src/codex/scrolls/ScrollOfSurvivabilityProtocol.jsx

import React from 'react';
import { scrollOfSurvivabilityProtocol } from './ScrollOfSurvivabilityProtocol.data';

export const ScrollOfSurvivabilityProtocol = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfSurvivabilityProtocol.name}</h2>
        <div className="shimmer-line">{scrollOfSurvivabilityProtocol.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfSurvivabilityProtocol.timestamp}</span>
        <span className="steward">Steward: {scrollOfSurvivabilityProtocol.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfSurvivabilityProtocol.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfSurvivabilityProtocol.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfSurvivabilityProtocol.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfSurvivabilityProtocol.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
