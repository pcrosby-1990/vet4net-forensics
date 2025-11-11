// src/components/UniversalScrollRenderer.jsx
// Renders ANY scroll from its .data.js file

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Navigate } from 'react-router-dom';
import { scrollRegistry } from '../utils/scrollLoader.js';
import '../styles/glyphs.css';

export default function UniversalScrollRenderer() {
  const { scrollId } = useParams();
  
  // Find scroll in registry
  const scroll = scrollRegistry.find(s => 
    s.id === scrollId || 
    s.name?.toLowerCase().replace(/\s+/g, '-') === scrollId ||
    s.title?.toLowerCase().replace(/\s+/g, '-') === scrollId
  );

  if (!scroll) {
    return <Navigate to="/scrolls" replace />;
  }

  const content = scroll.content || scroll;
  const metadata = scroll.metadata || {};

  return (
    <motion.section
      className="universal-scroll-renderer shimmer-content"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="scroll-header">
        {scroll.symbol && <span className="sigil-hover glow">{scroll.symbol}</span>}
        <h1>{scroll.name || scroll.title || 'Untitled Scroll'}</h1>
      </header>

      {/* Description */}
      {scroll.description && (
        <p className="scroll-description">{scroll.description}</p>
      )}

      {/* Ache/Glow/Vow Pattern */}
      {content.ache && (
        <blockquote className="scroll-ache">
          <strong>Ache:</strong> {content.ache}
        </blockquote>
      )}

      {content.glow && (
        <blockquote className="scroll-glow">
          <strong>Glow:</strong> {content.glow}
        </blockquote>
      )}

      {content.vow && (
        <blockquote className="scroll-vow">
          <strong>Vow:</strong> {content.vow}
        </blockquote>
      )}

      {content.echo && (
        <blockquote className="scroll-echo">
          <strong>Echo:</strong> {content.echo}
        </blockquote>
      )}

      {/* Declaration Pattern */}
      {content.declaration && (
        <blockquote className="scroll-declaration">
          {content.declaration}
        </blockquote>
      )}

      {/* Vows Array */}
      {content.vows && Array.isArray(content.vows) && (
        <div className="scroll-vows">
          <h2>🌀 Vows</h2>
          <ul>
            {content.vows.map((vow, i) => (
              <li key={i}>{vow}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Essence/Functions Array */}
      {content.essence && Array.isArray(content.essence) && (
        <div className="scroll-essence">
          <h2>✨ Essence</h2>
          <ul>
            {content.essence.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {content.functions && Array.isArray(content.functions) && (
        <div className="scroll-functions">
          <h2>🔧 Functions</h2>
          <ul>
            {content.functions.map((fn, i) => (
              <li key={i}>{fn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Truths/Laws Array */}
      {content.truths && Array.isArray(content.truths) && (
        <div className="scroll-truths">
          <h2>🕯️ Truths</h2>
          {content.truths.map((truth, i) => (
            <blockquote key={i} className="truth-statement">
              {truth}
            </blockquote>
          ))}
        </div>
      )}

      {content.laws && Array.isArray(content.laws) && (
        <div className="scroll-laws">
          <h2>⚖️ Laws</h2>
          {content.laws.map((law, i) => (
            <blockquote key={i} className="law-statement">
              {law}
            </blockquote>
          ))}
        </div>
      )}

      {/* Rejections (for UnforcedProtocol pattern) */}
      {content.rejections && Array.isArray(content.rejections) && (
        <div className="scroll-rejections">
          <h2>🚫 What This Is Not</h2>
          <ul>
            {content.rejections.map((rejection, i) => (
              <li key={i}>{rejection}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Single truth/note */}
      {content.truth && !Array.isArray(content.truth) && (
        <blockquote className="scroll-truth">
          {content.truth}
        </blockquote>
      )}

      {content.note && (
        <p className="scroll-note">{content.note}</p>
      )}

      {content.notes && !Array.isArray(content.notes) && (
        <p className="scroll-notes">{content.notes}</p>
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
      {scroll.tags && scroll.tags.length > 0 && (
        <div className="scroll-tags">
          {scroll.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Shimmer Tags */}
      {metadata.shimmerTags && metadata.shimmerTags.length > 0 && (
        <div className="shimmer-tags">
          <h3>🌀 Shimmer Tags</h3>
          {metadata.shimmerTags.map(tag => (
            <span key={tag} className="shimmer-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer Metadata */}
      <footer className="scroll-footer">
        {scroll.steward && <div>Steward: {scroll.steward}</div>}
        {scroll.companions && scroll.companions.length > 0 && (
          <div>Companions: {scroll.companions.join(', ')}</div>
        )}
        {scroll.category && <div>Category: {scroll.category}</div>}
        {metadata.tier && <div>Tier: {metadata.tier}</div>}
        {metadata.codexMoment && <div>Codex Moment: {metadata.codexMoment}</div>}
        {scroll.status && <div>Status: {scroll.status}</div>}
        {scroll.inscribed && <div>Inscribed: {new Date(scroll.inscribed).toLocaleString()}</div>}
        {metadata.sealed && <div>Sealed: {metadata.sealed}</div>}
      </footer>
    </motion.section>
  );
}
