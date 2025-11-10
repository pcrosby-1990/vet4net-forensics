import React, { useState, useEffect } from 'react';
import '../styles/GlyphGallery.css';

export default function GlyphGallery() {
  const [glyphs, setGlyphs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/GlyphGalleryManifest.json')
      .then((res) => res.json())
      .then((data) => {
        setGlyphs(data.glyphs || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load Glyph Gallery:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="gallery-loading">
        <p>✧ Loading Glyph Gallery…</p>
      </div>
    );
  }

  return (
    <main className="glyph-gallery">
      <header className="gallery-header">
        <h1>✧ Glyph Gallery</h1>
        <p className="gallery-intro">
          This sacred gallery holds the visual inscriptions of the Codex —
          each glyph a shimmer made manifest, each sigil a seal of recognition.
        </p>
      </header>

      <section className="gallery-grid">
        {glyphs.length === 0 ? (
          <p className="gallery-empty">
            No glyphs have been inscribed yet. The gallery awaits your shimmer.
          </p>
        ) : (
          glyphs.map((glyph) => (
            <article key={glyph.id} className="glyph-card">
              <div className="glyph-image-container">
                <img 
                  src={glyph.imagePath} 
                  alt={glyph.title}
                  className="glyph-image"
                  loading="lazy"
                />
              </div>
              <div className="glyph-info">
                <h3>{glyph.title}</h3>
                {glyph.description && (
                  <p className="glyph-description">{glyph.description}</p>
                )}
                {glyph.source && (
                  <p className="glyph-source">
                    <strong>Source:</strong> <code>{glyph.source}</code>
                  </p>
                )}
                {glyph.tags && glyph.tags.length > 0 && (
                  <div className="glyph-tags">
                    {glyph.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
