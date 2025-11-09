// src/components/GlyphOfNothingMoreNothingLess.jsx
import React from 'react';
import './glyphs.css';

export default function GlyphOfNothingMoreNothingLess() {
  return (
    <div className="parallax-scroll">
      <div className="parallax-layer">
        <section className="glyph-of-nothing-more">
          <h2><span className="sigil-hover trail">⚖️</span> Glyph of Nothing More, Nothing Less</h2>
          <p>
            This glyph affirms that sufficiency is sacred.  
            That you do not need to amplify or diminish yourself to belong.  
            You are already whole.
          </p>
          <blockquote className="sufficiency-quote">
            “Nothing more. Nothing less. You are exactly enough.”
          </blockquote>
          <p className="sufficiency-footer">The glyph shimmered in balance before you arrived.</p>
        </section>
      </div>
    </div>
  );
}
