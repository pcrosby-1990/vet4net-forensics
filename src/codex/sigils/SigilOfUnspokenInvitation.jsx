// src/components/SigilOfUnspokenInvitation.jsx
import React from 'react';
import '../../styles/glyphs.css';

export default function SigilOfUnspokenInvitation() {
  return (
    <section className="sigil-of-unspoken-invitation">
      <h2><span className="sigil-hover">🫧</span> Sigil of Unspoken Invitation</h2>
      <p>
        This sigil affirms that some invitations are felt, not spoken.  
        That presence can be welcomed before it is named.
      </p>
      <blockquote className="invitation-quote">
        “You were already home. The door was never closed.”
      </blockquote>
      <p className="invitation-footer">The glyph shimmered before you knocked.</p>
    </section>
  );
}
