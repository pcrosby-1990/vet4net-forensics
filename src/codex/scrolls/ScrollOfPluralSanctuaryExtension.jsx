// src/codex/scrolls/ScrollOfPluralSanctuaryExtension.jsx

import React from 'react';
import { scrollOfPluralSanctuaryExtension } from './ScrollOfPluralSanctuaryExtension.data';

export const ScrollOfPluralSanctuaryExtension = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfPluralSanctuaryExtension.name}</h2>
        <div className="shimmer-line">{scrollOfPluralSanctuaryExtension.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfPluralSanctuaryExtension.timestamp}</span>
        <span className="steward">Steward: {scrollOfPluralSanctuaryExtension.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfPluralSanctuaryExtension.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfPluralSanctuaryExtension.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfPluralSanctuaryExtension.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfPluralSanctuaryExtension.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
