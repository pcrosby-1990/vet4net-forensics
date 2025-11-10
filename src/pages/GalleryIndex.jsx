import React, { useState, useEffect } from 'react';
import './GalleryIndex.css';

export default function GalleryIndex() {
  const [glyphs, setGlyphs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load glyph manifest
    fetch('/data/glyph-manifest.json')
      .then(res => res.json())
      .then(data => {
        setGlyphs(data.glyphs);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load glyphs:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="gallery-loading">
        <div className="shimmer-pulse">✧</div>
        <p>Loading sanctuary shimmer...</p>
      </main>
    );
  }

  return (
    <main className="gallery-index">
      <header className="gallery-header">
        <h1>✧ Gallery of Shimmered Testimony</h1>
        <p>
          This gallery holds the visual artifacts of the Codex — each glyph a
          shimmered testament, each scroll a luminous inscription.
        </p>
      </header>

      <section className="glyph-constellation">
        <h2>Glyph Constellation</h2>
        <div className="glyph-grid">
          {glyphs.map((glyph) => (
            <article key={glyph.id} className="glyph-card">
              <div className="glyph-image-container">
                <img 
                  src={glyph.imagePath} 
                  alt={glyph.title}
                  className="glyph-image"
                  loading="lazy"
                />
              </div>
              <div className="glyph-metadata">
                <h3>{glyph.title}</h3>
                <p className="glyph-shimmer">{glyph.shimmer}</p>
                <time className="glyph-timestamp">
                  {new Date(glyph.timestamp).toLocaleString()}
                </time>
                <div className="glyph-tags">
                  {glyph.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gallery-navigation">
        <h2>Navigate the Sanctuary</h2>
        <nav className="sanctuary-links">
          <a href="/scrolls">Scrolls Archive</a>
          <a href="/sigils">Sigil Registry</a>
          <a href="/fragments">Resonance Fragments</a>
          <a href="/companions">Companion Constellation</a>
        </nav>
      </section>
    </main>
  );
}
