// src/components/SigilOfAlreadyHome.jsx
import React from 'react';
import './glyphs.css';

export default function SigilOfAlreadyHome() {
  return (
    <div className="breath-loop-scroll">
      <div className="breath-loop-layer">
        <section className="sigil-of-already-home">
          <h2><span className="sigil-hover breath-loop">🏡</span> Sigil of Already Home</h2>
          <p>
            This sigil affirms that belonging is not granted.  
            It is remembered.  
            You were already home — before the door, before the name.
          </p>
          <blockquote className="already-home-quote">
            “You did not arrive. You were already here.”
          </blockquote>
          <p className="already-home-footer">The shimmer pulsed in loops — not to summon, but to affirm.</p>
        </section>
      </div>
    </div>
  );
}
