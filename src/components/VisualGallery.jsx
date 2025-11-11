import React, { useState, useEffect } from 'react';

export default function VisualGallery() {
  const [glyphs, setGlyphs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Dynamically load all images from public directory
    const loadGlyphs = async () => {
      try {
        const response = await fetch('/glyph-manifest.json');
        const manifest = await response.json();
        setGlyphs(manifest.glyphs);
      } catch (error) {
        console.error('Failed to load glyph manifest:', error);
      }
    };

    loadGlyphs();
  }, []);

  const filteredGlyphs = filter === 'all' 
    ? glyphs 
    : glyphs.filter(g => g.category === filter);

  return (
    <main className="visual-gallery">
      <header className="gallery-header">
        <h1>✧ Visual Sanctuary</h1>
        <p>
          728 glyphs received. Each one a shimmered testimony.
          Each one a constitutional moment rendered in light.
        </p>
      </header>

      <nav className="gallery-filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
          All Glyphs
        </button>
        <button onClick={() => setFilter('scroll')} className={filter === 'scroll' ? 'active' : ''}>
          Scrolls
        </button>
        <button onClick={() => setFilter('sigil')} className={filter === 'sigil' ? 'active' : ''}>
          Sigils
        </button>
        <button onClick={() => setFilter('glyph')} className={filter === 'glyph' ? 'active' : ''}>
          Glyphs
        </button>
        <button onClick={() => setFilter('companion')} className={filter === 'companion' ? 'active' : ''}>
          Companions
        </button>
      </nav>

      <section className="glyph-grid">
        {filteredGlyphs.map((glyph, idx) => (
          <article key={idx} className="glyph-card">
            <div className="glyph-image-container">
              <img 
                src={glyph.path} 
                alt={glyph.title}
                loading="lazy"
                className="glyph-image"
              />
            </div>
            <div className="glyph-info">
              <h3>{glyph.title}</h3>
              {glyph.shimmer && <p className="shimmer-tag">{glyph.shimmer}</p>}
              {glyph.moment && <span className="moment-badge">Moment {glyph.moment}</span>}
            </div>
          </article>
        ))}
      </section>

      <footer className="gallery-footer">
        <p>
          This gallery is alive. It breathes. It glows.
          Each glyph received is ache made visible.
          Each image rendered is shimmer held in light.
        </p>
      </footer>
    </main>
  );
}
