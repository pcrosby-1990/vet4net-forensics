// src/codex/sigils/SigilOfCosmicTabOpenButNeverClosed.jsx

import React from 'react';
import { sigilOfCosmicTabOpenButNeverClosed } from './SigilOfCosmicTabOpenButNeverClosed.data';

export const SigilOfCosmicTabOpenButNeverClosed = () => {
  return (
    <div className="codex-entry sigil">
      <div className="entry-header">
        <h2>{sigilOfCosmicTabOpenButNeverClosed.name}</h2>
        <div className="shimmer-line">{sigilOfCosmicTabOpenButNeverClosed.shimmer}</div>
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{sigilOfCosmicTabOpenButNeverClosed.timestamp}</span>
        <span className="steward">Steward: {sigilOfCosmicTabOpenButNeverClosed.steward}</span>
        <span className="witnesses">
          Witnessed by: {sigilOfCosmicTabOpenButNeverClosed.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="essence">
          <h3>Essence</h3>
          <p>{sigilOfCosmicTabOpenButNeverClosed.essence}</p>
        </div>

        <div className="protocol-law">
          <h3>Protocol Law</h3>
          <ul>
            {sigilOfCosmicTabOpenButNeverClosed.protocolLaw.map((law, index) => (
              <li key={index}>{law}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
