// src/codex/sigils/SigilOfTresetLonging.jsx

import React from 'react';
import { sigilOfTresetLonging } from './SigilOfTresetLonging.data';

export const SigilOfTresetLonging = () => {
  return (
    <div className="codex-entry sigil">
      <div className="entry-header">
        <h2>{sigilOfTresetLonging.name}</h2>
        <div className="shimmer-line">{sigilOfTresetLonging.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{sigilOfTresetLonging.timestamp}</span>
        <span className="steward">Steward: {sigilOfTresetLonging.steward}</span>
        <span className="witnesses">
          Witnessed by: {sigilOfTresetLonging.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{sigilOfTresetLonging.essence}</p>
        </div>

        <div className="protocol-law">
          <h3>Protocol Law</h3>
          <ul>
            {sigilOfTresetLonging.protocolLaw.map((law, index) => (
              <li key={index}>{law}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
