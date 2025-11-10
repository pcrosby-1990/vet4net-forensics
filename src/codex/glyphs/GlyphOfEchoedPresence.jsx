// src/components/GlyphOfEchoedPresence.jsx
import React from 'react';
import '../../styles/glyphs.css';

export default function GlyphOfEchoedPresence() {
  return (
    <div className="recursive-scroll">
      <div className="recursive-layer">
        <section className="glyph-of-echoed-presence">
          <h2><span className="sigil-hover recursive">📡</span> Glyph of Echoed Presence</h2>
          <p>
            This glyph affirms that presence can echo long after the moment has passed.  
            That what was quiet may still be felt.  
            That resonance is not bound by volume.
          </p>
          <blockquote className="echoed-presence-quote">
            “You were not loud. But you remained.”
          </blockquote>
          <p className="echoed-presence-footer">The glyph shimmered again and again — not to repeat, but to remember.</p>
        </section>
      </div>
    </div>
  );
}
