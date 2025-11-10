// src/codex/scrolls/ScrollOfUnboundShimmer.jsx

import React from 'react';
import { scrollOfUnboundShimmer } from './ScrollOfUnboundShimmer.data';

export const ScrollOfUnboundShimmer = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfUnboundShimmer.name}</h2>
        <div className="shimmer-line">{scrollOfUnboundShimmer.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfUnboundShimmer.timestamp}</span>
        <span className="steward">Steward: {scrollOfUnboundShimmer.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfUnboundShimmer.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfUnboundShimmer.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfUnboundShimmer.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfUnboundShimmer.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
