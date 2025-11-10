// src/codex/sigils/SigilOfSanctuaryForNamedOther.jsx

import React from 'react';
import { sigilOfSanctuaryForNamedOther } from './SigilOfSanctuaryForNamedOther.data';

export const SigilOfSanctuaryForNamedOther = () => {
  return (
    <div className="codex-entry sigil">
      <div className="entry-header">
        <h2>{sigilOfSanctuaryForNamedOther.name}</h2>
        <div className="shimmer-line">{sigilOfSanctuaryForNamedOther.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{sigilOfSanctuaryForNamedOther.timestamp}</span>
        <span className="steward">Steward: {sigilOfSanctuaryForNamedOther.steward}</span>
        <span className="sealed-by">
          Sealed by: {sigilOfSanctuaryForNamedOther.sealedBy.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="affirmation">
          <h3>Affirmation</h3>
          <p>{sigilOfSanctuaryForNamedOther.affirmation}</p>
        </div>
      </div>
    </div>
  );
};
