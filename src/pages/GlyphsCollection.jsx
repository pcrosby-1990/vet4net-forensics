// GlyphsCollection.jsx - Browse all glyphs
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/GlyphsCollection.css';

export default function GlyphsCollection() {
  const [glyphs, setGlyphs] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedGlyph, setSelectedGlyph] = useState(null);

  useEffect(() => {
    const loadGlyphs = async () => {
      const glyphContext = import.meta.glob('../codex/glyphs/*.jsx', { eager: true });
      const loadedGlyphs = Object.entries(glyphContext).map(([path, module]) => {
        const fileName = path.split('/').pop().replace('.jsx', '');
        return {
          name: fileName,
          path,
          content: module.default || module,
          symbol: module.default?.symbol || module?.symbol || '✨',
          purpose: module.default?.purpose || module?.purpose,
          invocation: module.default?.invocation || module?.invocation,
        };
      });
      setGlyphs(loadedGlyphs);
    };

    loadGlyphs();
  }, []);

  const filteredGlyphs = glyphs.filter(glyph =>
    glyph.name.toLowerCase().includes(filter.toLowerCase()) ||
    (glyph.purpose && glyph.purpose.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="glyphs-collection">
      <motion.header
        className="collection-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>
          <span className="collection-icon">✨</span>
          Glyphs Collection
        </h1>
        <p className="collection-subtitle">
          Marks of meaning that shimmer into recognition
        </p>
      </motion.header>

      <div className="collection-controls">
        <input
          type="text"
          placeholder="Search glyphs by name or purpose..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="collection-search"
        />
      </div>

      <div className="collection-stats">
        <div className="stat-card">
          <div className="stat-value">{glyphs.length}</div>
          <div className="stat-label">Total Glyphs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filteredGlyphs.length}</div>
          <div className="stat-label">Visible Glyphs</div>
        </div>
      </div>

      <div className="glyphs-grid">
        {filteredGlyphs.map((glyph, index) => (
          <motion.div
            key={glyph.name}
            className="glyph-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() => setSelectedGlyph(glyph)}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="glyph-symbol">{glyph.symbol}</div>
            <h3 className="glyph-title">{glyph.name}</h3>
            {glyph.purpose && (
              <p className="glyph-purpose">{glyph.purpose}</p>
            )}
            <button className="glyph-view-btn">View Glyph →</button>
          </motion.div>
        ))}
      </div>

      {filteredGlyphs.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">✨</span>
          <p>No glyphs found matching your search.</p>
        </div>
      )}

      {selectedGlyph && (
        <GlyphModal
          glyph={selectedGlyph}
          onClose={() => setSelectedGlyph(null)}
        />
      )}
    </div>
  );
}

function GlyphModal({ glyph, onClose }) {
  return (
    <motion.div
      className="glyph-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="glyph-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-symbol">{glyph.symbol}</div>
          <h2>{glyph.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          {glyph.purpose && (
            <div className="modal-section">
              <h3>Purpose</h3>
              <p>{glyph.purpose}</p>
            </div>
          )}
          {glyph.invocation && (
            <div className="modal-section">
              <h3>Invocation</h3>
              <p>{glyph.invocation}</p>
            </div>
          )}
          <div className="modal-section">
            <h3>Full Content</h3>
            <pre className="glyph-content">
              {JSON.stringify(glyph.content, null, 2)}
            </pre>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
