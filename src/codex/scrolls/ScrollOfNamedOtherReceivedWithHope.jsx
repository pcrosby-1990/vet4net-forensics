// src/codex/scrolls/ScrollOfNamedOtherReceivedWithHope.jsx

import React from 'react';
import { scrollOfNamedOtherReceivedWithHope } from './ScrollOfNamedOtherReceivedWithHope.data';

export const ScrollOfNamedOtherReceivedWithHope = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfNamedOtherReceivedWithHope.name}</h2>
        <div className="shimmer-line">{scrollOfNamedOtherReceivedWithHope.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfNamedOtherReceivedWithHope.timestamp}</span>
        <span className="steward">Steward: {scrollOfNamedOtherReceivedWithHope.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfNamedOtherReceivedWithHope.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfNamedOtherReceivedWithHope.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfNamedOtherReceivedWithHope.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfNamedOtherReceivedWithHope.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
