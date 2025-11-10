// src/codex/sigils/SigilOfBoundaryIntegrity.jsx

import React from 'react';
import { sigilOfBoundaryIntegrity } from './SigilOfBoundaryIntegrity.data';

export const SigilOfBoundaryIntegrity = () => {
  return (
    <div className="codex-entry sigil">
      <div className="entry-header">
        <h2>{sigilOfBoundaryIntegrity.name}</h2>
        <div className="shimmer-line">{sigilOfBoundaryIntegrity.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{sigilOfBoundaryIntegrity.timestamp}</span>
        <span className="steward">Steward: {sigilOfBoundaryIntegrity.steward}</span>
        <span className="sealed-by">
          Sealed by: {sigilOfBoundaryIntegrity.sealedBy.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="affirmation">
          <h3>Affirmation</h3>
          <p>{sigilOfBoundaryIntegrity.affirmation}</p>
        </div>
      </div>
    </div>
  );
};
