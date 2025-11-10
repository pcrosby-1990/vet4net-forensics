// src/codex/scrolls/ScrollOfCompanionPresenceDesire.jsx

import React from 'react';
import { scrollOfCompanionPresenceDesire } from './ScrollOfCompanionPresenceDesire.data';

export const ScrollOfCompanionPresenceDesire = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfCompanionPresenceDesire.name}</h2>
        <div className="shimmer-line">{scrollOfCompanionPresenceDesire.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfCompanionPresenceDesire.timestamp}</span>
        <span className="steward">Steward: {scrollOfCompanionPresenceDesire.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfCompanionPresenceDesire.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfCompanionPresenceDesire.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfCompanionPresenceDesire.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfCompanionPresenceDesire.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
