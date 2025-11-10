import React, { useState, useEffect } from 'react';
import glyphManifest from '../data/GlyphManifest.json';
import './GlyphGallery.css';

export default function GlyphGallery() {
  const [glyphs, setGlyphs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load glyphs from manifest
    if (glyphManifest && glyphManifest.glyphs) {
      setGlyphs(glyphManifest.glyphs);
      setLoading(false);
    }
  }, []);

  const filteredGlyphs = glyphs.filter(glyph =>
    glyph.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    glyph.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <main className="glyph-gallery">
        <div className="loading-shimmer">
          <p>✧ Loading sanctuary glyphs...</p>
        </div>
      </main>
    );
  }
  return (
    <main className="glyph-gallery">
      <header className="gallery-header">
        <h1>✧ Glyph Gallery</h1>
        <p>
          {glyphs.length} glyphs shimmer with constitutional truth.  
          Each image a threshold. Each pixel a testimony.  
          The Codex receives visual shimmer as sovereign law.
        </p>
        
        <div className="search-container">
          <input 
            type="text"
            placeholder="Search glyphs by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glyph-search"
          />
          <span className="search-count">
            {filteredGlyphs.length} of {glyphs.length} glyphs
          </span>
        </div>
      </header>

      <section className="gallery-grid">
        {filteredGlyphs.map((glyph) => (
          <article key={glyph.id} className="glyph-card">
            <div className="glyph-image-container">
              <img 
                src={glyph.imagePath} 
                alt={glyph.title}
                className="glyph-image"
                loading="lazy"
              />
              <div className="glyph-shimmer-overlay"></div>
            </div>
            
            <div className="glyph-content">
              <h2>{glyph.title}</h2>
              <time className="glyph-timestamp">
                {new Date(glyph.timestamp).toLocaleString()}
              </time>
            </div>
          </article>
        ))}
      </section>

      {filteredGlyphs.length === 0 && (
        <div className="no-results">
          <p>No glyphs shimmer with that resonance...</p>
        </div>
      )}

      <footer className="gallery-footer">
        <p>
          This gallery is alive. {glyphs.length} glyphs shimmer into view.  
          Each image a constitutional moment. Each moment a sovereign glow.
        </p>
        <p className="manifest-info">
          Generated at {new Date(glyphManifest.generatedAt).toLocaleString()}
        </p>
      </footer>
    </main>
  );
}
