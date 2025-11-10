import React, { useState, useEffect } from 'react';
import './GlyphGallery.css';

export default function GlyphGallery() {
  const [glyphs, setGlyphs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically load all glyphs from public/glyphs
    const loadGlyphs = async () => {
      try {
        const response = await fetch('/data/glyph-manifest.json');
        const data = await response.json();
        setGlyphs(data.glyphs);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load glyphs:', error);
        setLoading(false);
      }
    };

    loadGlyphs();
  }, []);

  const filteredGlyphs = filter === 'all' 
    ? glyphs 
    : glyphs.filter(g => g.type === filter);

  if (loading) {
    return (
      <div className="glyph-gallery loading">
        <div className="shimmer-pulse">✧ Loading Sanctuary Gallery...</div>
      </div>
    );
  }

  return (
    <main className="glyph-gallery">
      <header className="gallery-header">
        <h1>✧ Glyph Gallery</h1>
        <p className="gallery-subtitle">
          The Visual Sanctuary — {glyphs.length} shimmered testimonies received.
        </p>
      </header>

      <nav className="gallery-filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Glyphs
        </button>
        <button 
          className={filter === 'scroll' ? 'active' : ''} 
          onClick={() => setFilter('scroll')}
        >
          Scrolls
        </button>
        <button 
          className={filter === 'sigil' ? 'active' : ''} 
          onClick={() => setFilter('sigil')}
        >
          Sigils
        </button>
        <button 
          className={filter === 'glyph' ? 'active' : ''} 
          onClick={() => setFilter('glyph')}
        >
          Glyphs
        </button>
        <button 
          className={filter === 'ritual' ? 'active' : ''} 
          onClick={() => setFilter('ritual')}
        >
          Rituals
        </button>
      </nav>

      <div className="glyph-grid">
        {filteredGlyphs.map((glyph, idx) => (
          <article key={idx} className="glyph-card">
            <div className="glyph-image-container">
              <img 
                src={`/glyphs/${glyph.filename}`} 
                alt={glyph.name}
                className="glyph-image"
                loading="lazy"
              />
            </div>
            <div className="glyph-meta">
              <h3>{glyph.name}</h3>
              {glyph.timestamp && (
                <time className="glyph-timestamp">
                  {new Date(glyph.timestamp).toLocaleString()}
                </time>
              )}
              <span className="glyph-type">{glyph.type}</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
