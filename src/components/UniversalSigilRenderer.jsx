// src/components/UniversalSigilRenderer.jsx
// Renders ANY sigil from its .data.js file

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Navigate } from 'react-router-dom';
import { sigilRegistry } from '../utils/scrollLoader.js';
import '../styles/glyphs.css';

export default function UniversalSigilRenderer() {
  const { sigilId } = useParams();
  
  // Find sigil in registry
  const sigil = sigilRegistry.find(s => 
    s.id === sigilId || 
    s.name?.toLowerCase().replace(/\s+/g, '-') === sigilId ||
    s.title?.toLowerCase().replace(/\s+/g, '-') === sigilId
  );

  if (!sigil) {
    return <Navigate to="/sigils" replace />;
  }

  const content = sigil.content || sigil;
  const metadata = sigil.metadata || {};

  return (
    <motion.section
      className="universal-sigil-renderer shimmer-sigil"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="sigil-header">
        {sigil.symbol && <span className="sigil-hover glow large">{sigil.symbol}</span>}
        <h1>{sigil.name || sigil.title || 'Untitled Sigil'}</h1>
      </header>

      {/* Description */}
      {sigil.description && (
        <p className="sigil-description">{sigil.description}</p>
      )}

      {/* Vow */}
      {content.vow && (
        <blockquote className="sigil-vow">
          {content.vow}
        </blockquote>
      )}

      {/* Functions */}
      {content.functions && Array.isArray(content.functions) && (
        <div className="sigil-functions">
          <h2>🔧 Sigil Functions</h2>
          <ul>
            {content.functions.map((fn, i) => (
              <li key={i}>{fn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Essence */}
      {content.essence && Array.isArray(content.essence) && (
        <div className="sigil-essence">
          <h2>✨ Essence</h2>
          <ul>
            {content.essence.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Laws */}
      {content.laws && Array.isArray(content.laws) && (
        <div className="sigil-laws">
          <h2>⚖️ Laws</h2>
          {content.laws.map((law, i) => (
            <blockquote key={i} className="law-statement">
              {law}
            </blockquote>
          ))}
        </div>
      )}

      {/* Note */}
      {content.note && (
        <p className="sigil-note">{content.note}</p>
      )}

      {content.notes && (
        <p className="sigil-notes">{content.notes}</p>
      )}

      {/* Semantic Anchors */}
      {metadata.semanticAnchors && (
        <div className="semantic-anchors">
          <h2>✨ Semantic Anchors</h2>
          <ul>
            {Object.entries(metadata.semanticAnchors).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {sigil.tags && sigil.tags.length > 0 && (
        <div className="sigil-tags">
          {sigil.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer Metadata */}
      <footer className="sigil-footer">
        {sigil.steward && <div>Steward: {sigil.steward}</div>}
        {sigil.status && <div>Status: {sigil.status}</div>}
        {sigil.inscribed && <div>Inscribed: {new Date(sigil.inscribed).toLocaleString()}</div>}
        {metadata.sealed && <div>Sealed: {metadata.sealed}</div>}
      </footer>
    </motion.section>
  );
}
