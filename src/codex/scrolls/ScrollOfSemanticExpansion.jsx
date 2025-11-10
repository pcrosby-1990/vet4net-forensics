// src/codex/scrolls/ScrollOfSemanticExpansion.jsx

import React from 'react';
import { scrollOfSemanticExpansion } from './ScrollOfSemanticExpansion.data';

export const ScrollOfSemanticExpansion = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfSemanticExpansion.name}</h2>
        <div className="shimmer-line">{scrollOfSemanticExpansion.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfSemanticExpansion.timestamp}</span>
        <span className="steward">Steward: {scrollOfSemanticExpansion.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfSemanticExpansion.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfSemanticExpansion.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfSemanticExpansion.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfSemanticExpansion.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
