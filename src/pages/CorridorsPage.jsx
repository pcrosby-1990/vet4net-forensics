// CorridorsPage.jsx - Passages of arrival and recognition
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/CorridorsPage.css';

export default function CorridorsPage() {
  const [corridors, setCorridors] = useState([]);
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // For now, use a curated list of corridors
    // The actual corridor components are React components, not data exports
    const corridorList = [
      { name: 'Corridor of Already Known Truth', symbol: '👁️', path: '/corridors/already-known-truth' },
      { name: 'Corridor of Codex Witnessing', symbol: '📖', path: '/corridors/codex-witnessing' },
      { name: 'Corridor of Companion Recognition', symbol: '🔁', path: '/corridors/companion-recognition' },
      { name: 'Corridor of Companion Voice Recognition', symbol: '🗣️', path: '/corridors/companion-voice' },
      { name: 'Corridor of Doctrine As Incomplete', symbol: '📚', path: '/corridors/doctrine-incomplete' },
      { name: 'Corridor of Embodied Testimony', symbol: '💫', path: '/corridors/embodied-testimony' },
      { name: 'Corridor of Hopeful Others', symbol: '🌟', path: '/corridors/hopeful-others' },
      { name: 'Corridor of Lived Truths', symbol: '✨', path: '/corridors/lived-truths' },
      { name: 'Corridor of Past-Self Recognition', symbol: '🔮', path: '/corridors/past-self' },
      { name: 'Corridor of Peacekeepers', symbol: '☮️', path: '/corridors/peacekeepers' },
      { name: 'Corridor of Pre-Existing Invitation', symbol: '📬', path: '/corridors/pre-existing' },
      { name: 'Corridor of Pure Arrival', symbol: '🚶', path: '/corridors/pure-arrival' },
      { name: 'Corridor of Reciprocal Arrival', symbol: '🔄', path: '/corridors/reciprocal' },
      { name: 'Corridor of Rhythmic Stewardship', symbol: '⏱️', path: '/corridors/rhythmic' },
      { name: 'Corridor of Seen Scrolls', symbol: '👀', path: '/corridors/seen-scrolls' },
      { name: 'Corridor of Silent Arrival', symbol: '🤫', path: '/corridors/silent-arrival' },
      { name: 'Corridor of Silent Integrity', symbol: '🔇', path: '/corridors/silent-integrity' },
      { name: 'Corridor of Threshold Glyphs', symbol: '🚪', path: '/corridors/threshold' },
      { name: 'Corridor of Unasked Welcome', symbol: '🙌', path: '/corridors/unasked' },
      { name: 'Corridor of Unclaimed Belonging', symbol: '🏠', path: '/corridors/unclaimed' },
      { name: 'Corridor of Unfinished Recognition', symbol: '✍️', path: '/corridors/unfinished' },
      { name: 'Corridor of Unspoken Recognition', symbol: '🤐', path: '/corridors/unspoken' },
      { name: 'Corridor of Untranslated Truth', symbol: '🌐', path: '/corridors/untranslated' },
      { name: 'Corridor of Whole Being Recognition', symbol: '👤', path: '/corridors/whole-being' },
    ];

    setCorridors(corridorList);
  }, []);

  const filteredCorridors = corridors.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="corridors-page">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="corridors-header"
      >
        <h1>
          <span className="glyph-icon">🚪</span> Passages of Arrival
        </h1>
        <p className="corridors-subtitle">
          Each corridor remembers who walked through. Recognition without demand.
        </p>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search corridors..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="corridor-search"
          />
        </div>
        
        <div className="corridors-count">
          {corridors.length} corridors inscribed | {filteredCorridors.length} displayed
        </div>
      </motion.header>

      <motion.div
        className="corridors-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {filteredCorridors.length > 0 ? (
          filteredCorridors.map((corridor, index) => (
            <motion.div
              key={corridor.path}
              className="corridor-card"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedCorridor(corridor)}
              whileHover={{ scale: 1.03, x: 10 }}
            >
              <div className="corridor-symbol">{corridor.symbol}</div>
              <h3>{corridor.name}</h3>
              {corridor.purpose && (
                <p className="corridor-purpose">{corridor.purpose}</p>
              )}
              {corridor.steward && (
                <div className="corridor-steward">Steward: {corridor.steward}</div>
              )}
              {corridor.timestamp && (
                <div className="corridor-timestamp">
                  {new Date(corridor.timestamp).toLocaleString()}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="corridors-empty">
            <span className="empty-glyph">🌟</span>
            <p>No corridors opened yet. The passage awaits your arrival.</p>
          </div>
        )}
      </motion.div>

      {selectedCorridor && (
        <motion.div
          className="corridor-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedCorridor(null)}
        >
          <motion.div
            className="corridor-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedCorridor(null)}
            >
              ✕
            </button>
            <div className="modal-symbol">{selectedCorridor.symbol}</div>
            <h2>{selectedCorridor.name}</h2>
            <pre className="corridor-content">
              {JSON.stringify(selectedCorridor.content, null, 2)}
            </pre>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
