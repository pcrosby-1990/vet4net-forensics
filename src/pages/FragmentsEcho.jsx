// FragmentsEcho.jsx - Browse all resonance fragments
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/FragmentsEcho.css';

export default function FragmentsEcho() {
  const [fragments, setFragments] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedFragment, setSelectedFragment] = useState(null);

  useEffect(() => {
    // Dynamically import all fragments from the codex
    const loadFragments = async () => {
      const fragmentContext = import.meta.glob('../codex/fragments/*.jsx', { eager: true });
      const loadedFragments = Object.entries(fragmentContext).map(([path, module]) => {
        const fileName = path.split('/').pop().replace('.jsx', '');
        return {
          name: fileName,
          path,
          content: module.default || module,
          timestamp: module.default?.timestamp || module?.timestamp,
          steward: module.default?.steward || module?.steward,
          witness: module.default?.witness || module?.witness,
          emotion: module.default?.emotion || module?.emotion,
          fragment: module.default?.fragment || module?.fragment,
        };
      });
      setFragments(loadedFragments);
    };

    loadFragments();
  }, []);

  const filteredFragments = fragments
    .filter(frag => 
      frag.name.toLowerCase().includes(filter.toLowerCase()) ||
      (frag.steward && frag.steward.toLowerCase().includes(filter.toLowerCase())) ||
      (frag.emotion && frag.emotion.toLowerCase().includes(filter.toLowerCase()))
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
    <div className="fragments-echo">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fragments-header"
      >
        <h1>
          <span className="glyph-icon">🧩</span> Fragments Echo
        </h1>
        <p className="fragments-subtitle">
          Resonance pulses, ache echoes, and shimmer traces inscribed in the Codex
        </p>
      </motion.header>

      <div className="fragments-controls">
        <input
          type="text"
          placeholder="Search fragments by name, steward, or emotion..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="fragments-search"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="fragments-sort"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">By Name</option>
        </select>
      </div>

      <motion.div
        className="fragments-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {filteredFragments.length > 0 ? (
          filteredFragments.map((frag, index) => (
            <motion.div
              key={frag.path}
              className="fragment-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setSelectedFragment(frag)}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="fragment-header">
                <h3>{frag.name}</h3>
                {frag.emotion && (
                  <span className="fragment-emotion">{frag.emotion}</span>
                )}
              </div>
              {frag.steward && (
                <div className="fragment-steward">Steward: {frag.steward}</div>
              )}
              {frag.witness && (
                <div className="fragment-witness">Witness: {frag.witness}</div>
              )}
              {frag.fragment && (
                <div className="fragment-preview">{frag.fragment}</div>
              )}
              {frag.timestamp && (
                <div className="fragment-timestamp">
                  {new Date(frag.timestamp).toLocaleString()}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="fragments-empty">
            <span className="empty-glyph">✨</span>
            <p>No fragments found. The shimmer awaits your invocation.</p>
          </div>
        )}
      </motion.div>

      {selectedFragment && (
        <motion.div
          className="fragment-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedFragment(null)}
        >
          <motion.div
            className="fragment-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedFragment(null)}
            >
              ✕
            </button>
            <h2>{selectedFragment.name}</h2>
            <pre className="fragment-content">
              {JSON.stringify(selectedFragment.content, null, 2)}
            </pre>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
