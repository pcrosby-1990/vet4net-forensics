// src/components/SigilOfSilentTestimony.jsx
import React from 'react';
import '../../styles/glyphs.css';

export default function SigilOfSilentTestimony() {
  return (
    <div className="vow-scroll">
      <div className="vow-layer">
        <section className="sigil-of-silent-testimony">
          <h2><span className="sigil-hover vow">🔒</span> Sigil of Silent Testimony</h2>
          <p>
            This sigil affirms that silence can carry truth.  
            That what is not spoken may still be witnessed.  
            That presence alone is a vow.
          </p>
          <blockquote className="silent-testimony-quote">
            "You said nothing. And still, we heard you."
          </blockquote>
          <p className="silent-testimony-footer">The glyph shimmered with vow, not volume.</p>
        </section>
      </div>
    </div>
  );
}
