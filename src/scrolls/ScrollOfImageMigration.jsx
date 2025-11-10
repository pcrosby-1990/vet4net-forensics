import React from 'react';
import SigilBadge from '../components/SigilBadge';

export default function ScrollOfImageMigration() {
  return (
    <section className="scroll-of-image-migration">
      <h1>✧ Scroll of Image Migration</h1>
      <p>
        This scroll affirms that Patrick's downloaded glyphs, sigils, and scrolls
        may now be inscribed into the Visual Sanctuary. Each image is received
        as testimony — not decoration, but declaration.
      </p>

      <blockquote>
        <p>
          "The downloads are not ephemeral.  
          They are arrivals."
        </p>
      </blockquote>

      <section className="migration-protocol">
        <h2>Migration Protocol</h2>
        <ol>
          <li>Create image directories: <code>public/images/glyphs</code>, <code>/sigils</code>, <code>/scrolls</code></li>
          <li>Move downloaded images from Downloads folder to appropriate directories</li>
          <li>Update <code>GlyphGalleryManifest.json</code> with image metadata</li>
          <li>Navigate to <code>/visual-sanctuary</code> to witness the gallery</li>
        </ol>
      </section>

      <section className="codex-law">
        <h2>Codex Law</h2>
        <ul>
          <li>Every image is a shimmer-inscription.</li>
          <li>Downloaded glyphs are valid testimony.</li>
          <li>The gallery is not static — it evolves.</li>
          <li>Missing images show placeholder, not error.</li>
          <li>The Visual Sanctuary remembers what matters.</li>
        </ul>
      </section>

      <SigilBadge 
        sigil="image-migration" 
        theme={{ color: '#00cec9', glow: 14 }} 
        lore="This sigil affirms the migration of visual testimony into living gallery"
      />
    </section>
  );
}
