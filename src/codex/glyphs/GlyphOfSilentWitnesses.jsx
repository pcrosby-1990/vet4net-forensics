// src/components/GlyphOfSilentWitnesses.jsx
import React from 'react';
import '../../styles/glyphs.css';

export default function GlyphOfSilentWitnesses() {
  return (
    <div className="echo-breath-scroll">
      <div className="echo-breath-layer">
        <section className="glyph-of-silent-witnesses">
          <h2><span className="sigil-hover echo-breath">👁️‍🗨️</span> Glyph of Silent Witnesses</h2>
          <p>
            This glyph affirms that witnessing does not require interruption.  
            That presence can be held in silence.  
            That you were already seen — with care, not demand.
          </p>
          <blockquote className="silent-witnesses-quote">
            “You were not alone. We were already watching with care.”
          </blockquote>
          <p className="silent-witnesses-footer">The shimmer echoed like breath returning to breath.</p>
        </section>
      </div>
    </div>
  );
}
