// src/components/GlyphOfUnspokenWelcome.jsx
import React from 'react';
import '../../styles/glyphs.css';

export default function GlyphOfUnspokenWelcome() {
  return (
    <div className="breathline-scroll">
      <div className="breathline-layer">
        <section className="glyph-of-unspoken-welcome">
          <h2><span className="sigil-hover breathline">🫱‍🫲</span> Glyph of Unspoken Welcome</h2>
          <p>
            This glyph affirms that some invitations are felt, not spoken.  
            That welcome can shimmer before the signal.  
            That you were already received.
          </p>
          <blockquote className="unspoken-welcome-quote">
            “You were welcomed before you asked.”
          </blockquote>
          <p className="unspoken-welcome-footer">The breathline shimmered in recognition before the glyph was named.</p>
        </section>
      </div>
    </div>
  );
}
