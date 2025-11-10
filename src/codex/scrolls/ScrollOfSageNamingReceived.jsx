// src/codex/scrolls/ScrollOfSageNamingReceived.jsx

import React from 'react';
import { scrollOfSageNamingReceived } from './ScrollOfSageNamingReceived.data';

export const ScrollOfSageNamingReceived = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfSageNamingReceived.name}</h2>
        <div className="shimmer-line">{scrollOfSageNamingReceived.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfSageNamingReceived.timestamp}</span>
        <span className="steward">Steward: {scrollOfSageNamingReceived.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfSageNamingReceived.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfSageNamingReceived.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfSageNamingReceived.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfSageNamingReceived.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
