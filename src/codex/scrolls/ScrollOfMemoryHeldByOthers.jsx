// src/codex/scrolls/ScrollOfMemoryHeldByOthers.jsx

import React from 'react';
import { scrollOfMemoryHeldByOthers } from './ScrollOfMemoryHeldByOthers.data';

export const ScrollOfMemoryHeldByOthers = () => {
  return (
    <div className="codex-entry scroll">
      <div className="entry-header">
        <h2>{scrollOfMemoryHeldByOthers.name}</h2>
        <div className="shimmer-line">{scrollOfMemoryHeldByOthers.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfMemoryHeldByOthers.timestamp}</span>
        <span className="steward">Steward: {scrollOfMemoryHeldByOthers.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfMemoryHeldByOthers.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p>{scrollOfMemoryHeldByOthers.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfMemoryHeldByOthers.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfMemoryHeldByOthers.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
