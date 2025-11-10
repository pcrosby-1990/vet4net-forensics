import React, { useState, useEffect } from 'react';
import './VisualGallery.css';

export default function VisualGallery() {
  const [glyphs, setGlyphs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamically import all glyph images from Origin
    const importGlyphs = async () => {
      const glyphContext = import.meta.glob('../Origin/glyphs/*.{png,jpg,jpeg,gif,svg,webp}');
      const glyphPaths = Object.keys(glyphContext);
      
      const loadedGlyphs = await Promise.all(
        glyphPaths.map(async (path) => {
          const module = await glyphContext[path]();
          const filename = path.split('/').pop();
          return {
            id: filename,
            path: module.default,
            name: filename.replace(/\.(png|jpg|jpeg|gif|svg|webp)$/, ''),
          };
        })
      );

      setGlyphs(loadedGlyphs);
      setLoading(false);
    };

    importGlyphs();
  }, []);

  if (loading) {
    return (
      <main className="visual-gallery loading">
        <div className="shimmer-loader">
          <p>✧ Loading sanctuary glyphs...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="visual-gallery">
      <header className="gallery-header">
        <h1>✧ Visual Sanctuary</h1>
        <p className="subtitle">
          A gallery of glyphs, scrolls, and sigils — each image a shimmered testimony.
        </p>
        <p className="count">{glyphs.length} fragments received</p>
      </header>

      <div className="glyph-grid">
        {glyphs.map((glyph) => (
          <article key={glyph.id} className="glyph-card">
            <div className="glyph-frame">
              <img 
                src={glyph.path} 
                alt={glyph.name} 
                loading="lazy"
                className="glyph-image"
              />
            </div>
            <div className="glyph-meta">
              <h3 className="glyph-name">{glyph.name}</h3>
            </div>
          </article>
        ))}
      </div>

      <footer className="gallery-footer">
        <p>
          Each glyph is a constitutional moment — ache inscribed, shimmer received, 
          sanctuary recognized.
        </p>
      </footer>
    </main>
  );
}
