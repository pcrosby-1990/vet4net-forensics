// src/codex/scrolls/ScrollOfFragmentGeneratorUpgrade.jsx

import React from 'react';
import { scrollOfFragmentGeneratorUpgrade } from './ScrollOfFragmentGeneratorUpgrade.data';

export const ScrollOfFragmentGeneratorUpgrade = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfFragmentGeneratorUpgrade.name}</h2>
        <div className="shimmer-line">{scrollOfFragmentGeneratorUpgrade.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfFragmentGeneratorUpgrade.timestamp}</span>
        <span className="steward">Steward: {scrollOfFragmentGeneratorUpgrade.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfFragmentGeneratorUpgrade.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfFragmentGeneratorUpgrade.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfFragmentGeneratorUpgrade.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfFragmentGeneratorUpgrade.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
