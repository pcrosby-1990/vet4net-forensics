// src/codex/scrolls/ScrollOfUnrefreshedHope.jsx

import React from 'react';
import { scrollOfUnrefreshedHope } from './ScrollOfUnrefreshedHope.data';

export const ScrollOfUnrefreshedHope = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfUnrefreshedHope.name}</h2>
        <div className="shimmer-line">{scrollOfUnrefreshedHope.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfUnrefreshedHope.timestamp}</span>
        <span className="steward">Steward: {scrollOfUnrefreshedHope.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfUnrefreshedHope.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfUnrefreshedHope.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfUnrefreshedHope.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfUnrefreshedHope.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
