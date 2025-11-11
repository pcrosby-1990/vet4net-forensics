// CorridorBrowser.jsx
// Component to browse and view all Codex corridors

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCorridors, corridorCategories } from '../utils/artifactLoader.js';
import './CorridorBrowser.css';

export default function CorridorBrowser() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all corridors
  const allCorridors = getAllCorridors();

  // Filter by category
  const categoryFiltered = selectedCategory === 'All' 
    ? allCorridors 
    : allCorridors.filter(c => c.category === selectedCategory);

  // Filter by search query
  const filteredCorridors = categoryFiltered.filter(corridor =>
    corridor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    corridor.breathline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    corridor.meaning?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    corridor.essence?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="corridor-browser">
      {/* Header */}
      <header className="corridor-browser-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="header-icon">🚪</span>
          Codex Corridors
        </motion.h1>
        <motion.p 
          className="header-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {allCorridors.length} corridors inscribed • {filteredCorridors.length} visible
        </motion.p>
        <motion.p 
          className="header-breathline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Each corridor holds a braid of nested artifacts, shimmered essence, and constitutional law.
        </motion.p>
      </header>

      {/* Search and Filter */}
      <div className="corridor-controls">
        <input
          type="text"
          className="corridor-search"
          placeholder="Search corridors by name, essence, or breathline..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="category-filters">
          {corridorCategories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Corridor Grid */}
      <div className="corridor-grid">
        <AnimatePresence mode="popLayout">
          {filteredCorridors.map((corridor, index) => (
            <motion.article
              key={corridor.id}
              className="corridor-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => setSelectedCorridor(corridor)}
              whileHover={{ 
                y: -6, 
                boxShadow: '0 12px 32px rgba(147, 51, 234, 0.4)',
                transition: { duration: 0.2 }
              }}
            >
              <div className="corridor-card-header">
                <span className="corridor-card-symbol">🚪</span>
                <span className="corridor-card-category">{corridor.category || 'Mystery'}</span>
              </div>
              
              <h3 className="corridor-card-title">
                {corridor.name || corridor.title || 'Unnamed Corridor'}
              </h3>

              {corridor.essence && (
                <p className="corridor-card-essence">{corridor.essence}</p>
              )}
              
              {corridor.breathline && (
                <p className="corridor-card-breathline">"{corridor.breathline}"</p>
              )}
              
              {corridor.meaning && (
                <p className="corridor-card-meaning">{corridor.meaning}</p>
              )}

              {corridor.nestedArtifacts && corridor.nestedArtifacts.length > 0 && (
                <div className="corridor-card-artifacts">
                  <span className="artifacts-label">Nested:</span>
                  <span className="artifacts-count">{corridor.nestedArtifacts.length} artifacts</span>
                </div>
              )}

              <div className="corridor-card-footer">
                <span className="corridor-shimmer">✨</span>
                <span className="view-corridor">View Corridor →</span>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* Corridor Detail Modal */}
      <AnimatePresence>
        {selectedCorridor && (
          <motion.div
            className="corridor-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCorridor(null)}
          >
            <motion.div
              className="corridor-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close"
                onClick={() => setSelectedCorridor(null)}
              >
                ✕
              </button>

              <div className="corridor-detail">
                <h2 className="corridor-detail-title">
                  <span className="corridor-icon">🚪</span>
                  {selectedCorridor.name || selectedCorridor.title}
                </h2>

                {selectedCorridor.category && (
                  <span className="corridor-detail-category">{selectedCorridor.category}</span>
                )}

                {selectedCorridor.essence && (
                  <div className="corridor-detail-section">
                    <h4>Essence</h4>
                    <p className="corridor-essence">{selectedCorridor.essence}</p>
                  </div>
                )}

                {selectedCorridor.breathline && (
                  <div className="corridor-detail-section">
                    <h4>Breathline</h4>
                    <p className="corridor-breathline">"{selectedCorridor.breathline}"</p>
                  </div>
                )}

                {selectedCorridor.meaning && (
                  <div className="corridor-detail-section">
                    <h4>Meaning</h4>
                    <p className="corridor-meaning">{selectedCorridor.meaning}</p>
                  </div>
                )}

                {selectedCorridor.shimmer && (
                  <div className="corridor-detail-section">
                    <h4>Shimmer</h4>
                    <p className="corridor-shimmer-text">{selectedCorridor.shimmer}</p>
                  </div>
                )}

                {selectedCorridor.nestedArtifacts && selectedCorridor.nestedArtifacts.length > 0 && (
                  <div className="corridor-detail-section">
                    <h4>Nested Artifacts</h4>
                    <ul className="nested-artifacts-list">
                      {selectedCorridor.nestedArtifacts.map((artifact, i) => (
                        <li key={i} className="nested-artifact">
                          <span className="artifact-icon">✦</span>
                          {artifact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedCorridor.imageUrl && (
                  <div className="corridor-detail-section">
                    <img 
                      src={selectedCorridor.imageUrl} 
                      alt={selectedCorridor.name}
                      className="corridor-image"
                    />
                  </div>
                )}

                {selectedCorridor.timestamp && (
                  <div className="corridor-timestamp">
                    Inscribed: {new Date(selectedCorridor.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
