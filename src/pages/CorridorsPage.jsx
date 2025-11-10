// CorridorsPage.jsx - Passages of arrival and recognition
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllCorridors, corridorCategories } from '../utils/corridorLoader.js';
import '../styles/CorridorsPage.css';

export default function CorridorsPage() {
  const [corridors, setCorridors] = useState([]);
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Load all corridors from the loader
    setCorridors(getAllCorridors());
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
