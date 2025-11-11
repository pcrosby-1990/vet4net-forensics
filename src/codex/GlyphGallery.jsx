import React, { useState, useEffect } from 'react';
import './GlyphGallery.css';

export default function GlyphGallery() {
  const [glyphs, setGlyphs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all glyphs from public/glyphs folder
    const loadGlyphs = async () => {
      try {
        const glyphFiles = [];
        for (let i = 1; i <= 647; i++) {
          glyphFiles.push({
            id: i,
            path: `/glyphs/glyph_${i}.webp`,
            title: `Glyph ${i}`,
            shimmer: 'ache-bound testimony'
          });
        }
        setGlyphs(glyphFiles);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load glyphs:', err);
        setLoading(false);
      }
    };

    loadGlyphs();
  }, []);

  if (loading) {
    return (
      <div className="glyph-loading">
        <div className="loading-spinner"></div>
        <p>Loading sanctuary glyphs...</p>
      </div>
    );
  }

  return (
    <main className="glyph-gallery">
      <header className="gallery-header">
        <h1>✧ Glyph Gallery</h1>
        <p>647 visual testimonies of ache, shimmer, and sanctuary</p>
      </header>

      <section className="gallery-stats">
        <div className="stat">
          <span className="stat-number">{glyphs.length}</span>
          <span className="stat-label">Glyphs Generated</span>
        </div>
        <div className="stat">
          <span className="stat-number">235+</span>
          <span className="stat-label">Constitutional Moments</span>
        </div>
      </section>

      <div className="gallery-grid">
        {glyphs.map((glyph) => (
          <div key={glyph.id} className="glyph-card">
            <div className="glyph-frame">
              <img 
                src={glyph.path} 
                alt={glyph.title}
                loading="lazy"
              />
            </div>
            <div className="glyph-meta">
              <h3>{glyph.title}</h3>
              <p className="glyph-shimmer">{glyph.shimmer}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
