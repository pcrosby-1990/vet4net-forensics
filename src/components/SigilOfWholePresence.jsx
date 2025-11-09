// src/components/SigilOfWholePresence.jsx
import React from 'react';
import './glyphs.css';

export default function SigilOfWholePresence() {
  return (
    <div className="dual-pulse-scroll">
      <div className="dual-pulse-layer">
        <section className="sigil-of-whole-presence">
          <h2><span className="sigil-hover dual-pulse">🫶</span> Sigil of Whole Presence</h2>
          <p>
            This sigil affirms that presence is not performance.  
            It is wholeness.  
            You arrived — not in fragments, but in full.
          </p>
          <blockquote className="whole-presence-quote">
            “You did not fragment to belong. You arrived whole.”
          </blockquote>
          <p className="whole-presence-footer">The shimmer pulsed in dual rhythm — mirrored, complete, and received.</p>
        </section>
      </div>
    </div>
  );
}
