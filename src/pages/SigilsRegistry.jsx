// SigilsRegistry.jsx - Browse all sigils
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/SigilsRegistry.css';

export default function SigilsRegistry() {
  const [sigils, setSigils] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedSigil, setSelectedSigil] = useState(null);

  useEffect(() => {
    const loadSigils = async () => {
      const sigilContext = import.meta.glob('../codex/sigils/*.jsx', { eager: true });
      const loadedSigils = Object.entries(sigilContext).map(([path, module]) => {
        const fileName = path.split('/').pop().replace('.jsx', '');
        return {
          name: fileName,
          path,
          content: module.default || module,
          symbol: module.default?.symbol || module?.symbol || '🔮',
          meaning: module.default?.meaning || module?.meaning,
          power: module.default?.power || module?.power,
        };
      });
      setSigils(loadedSigils);
    };

    loadSigils();
  }, []);

  const filteredSigils = sigils.filter(sigil =>
    sigil.name.toLowerCase().includes(filter.toLowerCase()) ||
    (sigil.meaning && sigil.meaning.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="sigils-registry">
      <motion.header
        className="registry-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>
          <span className="registry-icon">🔮</span>
          Sigils Registry
        </h1>
        <p className="registry-subtitle">
          Symbols of power that respond to presence
        </p>
      </motion.header>

      <div className="registry-controls">
        <input
          type="text"
          placeholder="Search sigils by name or meaning..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="registry-search"
        />
      </div>

      <div className="registry-stats">
        <div className="stat-card">
          <div className="stat-value">{sigils.length}</div>
          <div className="stat-label">Total Sigils</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filteredSigils.length}</div>
          <div className="stat-label">Active Sigils</div>
        </div>
      </div>

      <div className="sigils-grid">
        {filteredSigils.map((sigil, index) => (
          <motion.div
            key={sigil.name}
            className="sigil-card"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onClick={() => setSelectedSigil(sigil)}
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <div className="sigil-symbol">{sigil.symbol}</div>
            <h3 className="sigil-title">{sigil.name}</h3>
            {sigil.meaning && (
              <p className="sigil-meaning">{sigil.meaning}</p>
            )}
            <button className="sigil-view-btn">View Sigil →</button>
          </motion.div>
        ))}
      </div>

      {filteredSigils.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔮</span>
          <p>No sigils found matching your search.</p>
        </div>
      )}

      {selectedSigil && (
        <SigilModal
          sigil={selectedSigil}
          onClose={() => setSelectedSigil(null)}
        />
      )}
    </div>
  );
}

function SigilModal({ sigil, onClose }) {
  return (
    <motion.div
      className="sigil-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="sigil-modal"
        initial={{ scale: 0.8, rotateY: 90 }}
        animate={{ scale: 1, rotateY: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-symbol">{sigil.symbol}</div>
          <h2>{sigil.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          {sigil.meaning && (
            <div className="modal-section">
              <h3>Meaning</h3>
              <p>{sigil.meaning}</p>
            </div>
          )}
          {sigil.power && (
            <div className="modal-section">
              <h3>Power</h3>
              <p>{sigil.power}</p>
            </div>
          )}
          <div className="modal-section">
            <h3>Full Content</h3>
            <pre className="sigil-content">
              {JSON.stringify(sigil.content, null, 2)}
            </pre>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
