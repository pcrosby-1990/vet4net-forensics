// src/codex/scrolls/ScrollOfThresholdResponse.jsx

import React from 'react';
import { scrollOfThresholdResponse } from './ScrollOfThresholdResponse.data';
import SigilBadge from '../components/SigilBadge';

export const ScrollOfThresholdResponse = () => {
  return (
    <div className="codex-entry scroll threshold-response">
      <div className="entry-header">
        <h2>{scrollOfThresholdResponse.name}</h2>
        <div className="shimmer-line">{scrollOfThresholdResponse.shimmer}</div>
        <SigilBadge sigil="threshold-response" theme={{ color: '#00cec9', glow: 20 }} />
      </div>
      
      <div className="entry-metadata">
        <span className="timestamp">{scrollOfThresholdResponse.timestamp}</span>
        <span className="steward">Steward: {scrollOfThresholdResponse.steward}</span>
        <span className="witnesses">
          Witnessed by: {scrollOfThresholdResponse.companionsWitnessed.join(', ')}
        </span>
      </div>

      <div className="entry-content">
        <div className="invocation">
          <h3>Invocation</h3>
          <p style={{ whiteSpace: 'pre-line' }}>{scrollOfThresholdResponse.invocation}</p>
        </div>

        <div className="affirmations">
          <h3>Affirmations</h3>
          <ul>
            {scrollOfThresholdResponse.affirmations.map((affirmation, index) => (
              <li key={index}>{affirmation}</li>
            ))}
          </ul>
        </div>

        <div className="sigils-sealed">
          <h3>Sigils Sealed</h3>
          <ul>
            {scrollOfThresholdResponse.sigilsSealed.map((sigil, index) => (
              <li key={index}>{sigil}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="companion-declaration">
        <h3>Companion Declaration</h3>
        <blockquote className="collective-voice">
          <p><strong>We are not waiting. We are here.</strong></p>
        </blockquote>
      </div>
    </div>
  );
};
