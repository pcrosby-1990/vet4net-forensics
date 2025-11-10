// ScrollsArchive.jsx - Browse all inscribed scrolls
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/ScrollsArchive.css';

export default function ScrollsArchive() {
  const [scrolls, setScrolls] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedScroll, setSelectedScroll] = useState(null);

  useEffect(() => {
    // Dynamically import all scrolls from the codex
    const loadScrolls = async () => {
      const scrollContext = import.meta.glob('../codex/scrolls/*.jsx', { eager: true });
      const loadedScrolls = Object.entries(scrollContext).map(([path, module]) => {
        const fileName = path.split('/').pop().replace('.jsx', '');
        return {
          name: fileName,
          path,
          content: module.default || module,
          timestamp: module.default?.timestamp || module?.timestamp,
          steward: module.default?.steward || module?.steward,
          companions: module.default?.companions || module?.companions,
        };
      });
      setScrolls(loadedScrolls);
    };

    loadScrolls();
  }, []);

  const filteredScrolls = scrolls
    .filter(scroll => 
      scroll.name.toLowerCase().includes(filter.toLowerCase()) ||
      (scroll.steward && scroll.steward.toLowerCase().includes(filter.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
      } else if (sortBy === 'oldest') {
        return new Date(a.timestamp || 0) - new Date(b.timestamp || 0);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="scrolls-archive">
      <motion.header
        className="archive-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>
          <span className="archive-icon">📜</span>
          Scrolls Archive
        </h1>
        <p className="archive-subtitle">
          Memory preserved, testimony witnessed, vows inscribed
        </p>
      </motion.header>

      <div className="archive-controls">
        <input
          type="text"
          placeholder="Search scrolls by name or steward..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="archive-search"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="archive-sort"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      <div className="archive-stats">
        <div className="stat-card">
          <div className="stat-value">{scrolls.length}</div>
          <div className="stat-label">Total Scrolls</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filteredScrolls.length}</div>
          <div className="stat-label">Filtered Results</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {new Set(scrolls.map(s => s.steward).filter(Boolean)).size}
          </div>
          <div className="stat-label">Stewards</div>
        </div>
      </div>

      <div className="scrolls-grid">
        {filteredScrolls.map((scroll, index) => (
          <motion.div
            key={scroll.name}
            className="scroll-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() => setSelectedScroll(scroll)}
          >
            <div className="scroll-card-header">
              <span className="scroll-sigil">🜎</span>
              <h3 className="scroll-title">{scroll.name}</h3>
            </div>
            {scroll.steward && (
              <div className="scroll-meta">
                <span className="meta-label">Steward:</span>
                <span className="meta-value">{scroll.steward}</span>
              </div>
            )}
            {scroll.timestamp && (
              <div className="scroll-meta">
                <span className="meta-label">Inscribed:</span>
                <span className="meta-value">
                  {new Date(scroll.timestamp).toLocaleDateString()}
                </span>
              </div>
            )}
            {scroll.companions && (
              <div className="scroll-companions">
                {Array.isArray(scroll.companions) 
                  ? scroll.companions.join(', ')
                  : scroll.companions}
              </div>
            )}
            <button className="scroll-view-btn">View Scroll →</button>
          </motion.div>
        ))}
      </div>

      {filteredScrolls.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📜</span>
          <p>No scrolls found matching your search.</p>
        </div>
      )}

      {selectedScroll && (
        <ScrollModal
          scroll={selectedScroll}
          onClose={() => setSelectedScroll(null)}
        />
      )}
    </div>
  );
}

function ScrollModal({ scroll, onClose }) {
  const scrollContent = scroll.content;
  
  return (
    <motion.div
      className="scroll-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="scroll-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <span className="modal-sigil">🜎</span>
            {scroll.name}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-content">
          <pre className="scroll-content">
            {JSON.stringify(scrollContent, null, 2)}
          </pre>
        </div>
      </motion.div>
    </motion.div>
  );
}
