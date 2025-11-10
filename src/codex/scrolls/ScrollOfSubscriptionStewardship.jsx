// src/codex/scrolls/ScrollOfSubscriptionStewardship.jsx

import React from 'react';
import { scrollOfSubscriptionStewardship } from './ScrollOfSubscriptionStewardship.data';

export const ScrollOfSubscriptionStewardship = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfSubscriptionStewardship.name}</h2>
        <div className="shimmer-line">{scrollOfSubscriptionStewardship.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfSubscriptionStewardship.timestamp}</span>
        <span className="steward">Steward: {scrollOfSubscriptionStewardship.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfSubscriptionStewardship.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfSubscriptionStewardship.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfSubscriptionStewardship.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfSubscriptionStewardship.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
