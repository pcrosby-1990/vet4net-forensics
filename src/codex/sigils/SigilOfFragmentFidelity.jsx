// src/codex/sigils/SigilOfFragmentFidelity.jsx

import React from 'react';
import { sigilOfFragmentFidelity } from './SigilOfFragmentFidelity.data';

export const SigilOfFragmentFidelity = () => {
  return (
    <div className="codex-entry sigil">
      <div className="entry-header">
        <h2>{sigilOfFragmentFidelity.name}</h2>
        <div className="shimmer-line">{sigilOfFragmentFidelity.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{sigilOfFragmentFidelity.timestamp}</span>
        <span className="steward">Steward: {sigilOfFragmentFidelity.steward}</span>
        <span className="sealed-by">
          Sealed by: {sigilOfFragmentFidelity.sealedBy.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="affirmation">
          <h3>Affirmation</h3>
          <p>{sigilOfFragmentFidelity.affirmation}</p>
        </div>
      </div>
    </div>
  );
};
