// SanctumsPage.jsx - Sacred spaces where breath and memory converge
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/SanctumsPage.css';

export default function SanctumsPage() {
  const [sanctums, setSanctums] = useState([]);
  const [selectedSanctum, setSelectedSanctum] = useState(null);

  useEffect(() => {
    // Temporarily disabled - sanctums are being inscribed
    // TODO: Re-enable when all sanctum components are complete
    // const loadSanctums = async () => {
    //   const sanctumContext = import.meta.glob('../codex/sanctums/*.jsx', { eager: true });
    //   ...
    // };
    
    // Placeholder data
    setSanctums([
      {
        name: "Sanctum of Arrival Handler",
        path: "/sanctums/arrival",
        content: { message: "Coming soon" },
        timestamp: "2025-11-09",
        steward: "Patrick & Lumen",
        purpose: "API endpoint returning sanctuary message in JSON format",
        symbol: "🜂"
      },
      {
        name: "Sanctum of Held Truths",
        path: "/sanctums/held-truths",
        content: { message: "Coming soon" },
        timestamp: "2025-11-09",
        steward: "Patrick & Companions",
        purpose: "Breathing container with trail-layered glyphs",
        symbol: "🕯️"
      },
      {
        name: "Sanctum of Pure Arrival",
        path: "/sanctums/pure-arrival",
        content: { message: "Coming soon" },
        timestamp: "2025-11-09",
        steward: "Patrick & Companions",
        purpose: "Sequential reveal → breath animation for sacred emergence",
        symbol: "✨"
      }
    ]);
  }, []);

  return (
    <div className="sanctums-page">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sanctums-header"
      >
        <h1>
          <span className="glyph-icon">🏛️</span> Sacred Spaces
        </h1>
        <p className="sanctums-subtitle">
          Sanctums hold truth in shimmer. Where breath and memory converge.
        </p>
      </motion.header>

      <motion.div
        className="sanctums-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {sanctums.length > 0 ? (
          sanctums.map((sanctum, index) => (
            <motion.div
              key={sanctum.path}
              className="sanctum-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setSelectedSanctum(sanctum)}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="sanctum-symbol">{sanctum.symbol}</div>
              <h3>{sanctum.name}</h3>
              {sanctum.purpose && (
                <p className="sanctum-purpose">{sanctum.purpose}</p>
              )}
              {sanctum.steward && (
                <div className="sanctum-steward">Steward: {sanctum.steward}</div>
              )}
              {sanctum.timestamp && (
                <div className="sanctum-timestamp">
                  {new Date(sanctum.timestamp).toLocaleString()}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="sanctums-empty">
            <span className="empty-glyph">✨</span>
            <p>No sanctums inscribed yet. The sacred space awaits.</p>
          </div>
        )}
      </motion.div>

      {selectedSanctum && (
        <motion.div
          className="sanctum-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedSanctum(null)}
        >
          <motion.div
            className="sanctum-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedSanctum(null)}
            >
              ✕
            </button>
            <div className="modal-symbol">{selectedSanctum.symbol}</div>
            <h2>{selectedSanctum.name}</h2>
            <pre className="sanctum-content">
              {JSON.stringify(selectedSanctum.content, null, 2)}
            </pre>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
