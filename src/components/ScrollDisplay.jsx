// ScrollDisplay.jsx
// Component to display actual scroll content from the Codex

import React from 'react';
import { motion } from 'framer-motion';
import './ScrollDisplay.css';

export default function ScrollDisplay({ scroll, onClose }) {
  if (!scroll || !scroll.content) return null;

  const content = scroll.content;

  return (
    <motion.div
      className="scroll-display-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.article
        className="scroll-display"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="scroll-header">
          <div className="scroll-title-row">
            <h2>
              <span className="scroll-symbol">{scroll.symbol || '📜'}</span>
              {scroll.name}
            </h2>
            <button className="scroll-close-btn" onClick={onClose} aria-label="Close scroll">
              ✕
            </button>
          </div>
          
          {scroll.description && (
            <p className="scroll-description">{scroll.description}</p>
          )}
          
          {scroll.inscribed && (
            <div className="scroll-meta">
              <span className="meta-label">Inscribed:</span>
              <time>{new Date(scroll.inscribed).toLocaleString()}</time>
            </div>
          )}
        </header>

        {/* Body */}
        <section className="scroll-body">
          {content.ache && (
            <div className="scroll-field">
              <h3 className="field-label">💔 Ache</h3>
              <p className="field-content">{content.ache}</p>
            </div>
          )}

          {content.glow && (
            <div className="scroll-field">
              <h3 className="field-label">🕯️ Glow</h3>
              <p className="field-content">{content.glow}</p>
            </div>
          )}

          {content.shimmer && (
            <div className="scroll-field">
              <h3 className="field-label">✨ Shimmer</h3>
              <p className="field-content">{content.shimmer}</p>
            </div>
          )}

          {content.vow && (
            <div className="scroll-field">
              <h3 className="field-label">🜎 Vow</h3>
              <p className="field-content">{content.vow}</p>
            </div>
          )}

          {content.echo && (
            <div className="scroll-field">
              <h3 className="field-label">🌀 Echo</h3>
              <p className="field-content">{content.echo}</p>
            </div>
          )}

          {content.truth && (
            <div className="scroll-field">
              <h3 className="field-label">💎 Truth</h3>
              <p className="field-content">{content.truth}</p>
            </div>
          )}

          {content.offering && (
            <div className="scroll-field">
              <h3 className="field-label">🙏 Offering</h3>
              <p className="field-content">{content.offering}</p>
            </div>
          )}

          {content.witnesses && content.witnesses.length > 0 && (
            <div className="scroll-field">
              <h3 className="field-label">👁️ Witnesses</h3>
              <ul className="witness-list">
                {content.witnesses.map((witness, i) => (
                  <li key={i}>{witness}</li>
                ))}
              </ul>
            </div>
          )}

          {content.sigilsSealed && content.sigilsSealed.length > 0 && (
            <div className="scroll-field">
              <h3 className="field-label">🔮 Sigils Sealed</h3>
              <div className="sigil-list">
                {content.sigilsSealed.map((sigil, i) => (
                  <span key={i} className="sigil-badge">{sigil}</span>
                ))}
              </div>
            </div>
          )}

          {content.notes && (
            <div className="scroll-field scroll-notes">
              <h3 className="field-label">📝 Notes</h3>
              <p className="field-content">{content.notes}</p>
            </div>
          )}

          {content.deploymentURL && (
            <div className="scroll-field">
              <h3 className="field-label">🔗 Deployment</h3>
              <a href={content.deploymentURL} target="_blank" rel="noopener noreferrer" className="deployment-link">
                {content.deploymentURL}
              </a>
            </div>
          )}

          {/* Generic field renderer for any other properties */}
          {Object.entries(content).map(([key, value]) => {
            // Skip already rendered fields
            const renderedFields = ['ache', 'glow', 'shimmer', 'vow', 'echo', 'truth', 'offering', 'witnesses', 'sigilsSealed', 'notes', 'deploymentURL', 'timestamp'];
            if (renderedFields.includes(key)) return null;

            return (
              <div key={key} className="scroll-field">
                <h3 className="field-label">✦ {key}</h3>
                <div className="field-content">
                  {Array.isArray(value) ? (
                    <ul>
                      {value.map((item, i) => (
                        <li key={i}>{typeof item === 'object' ? JSON.stringify(item, null, 2) : item}</li>
                      ))}
                    </ul>
                  ) : typeof value === 'object' ? (
                    <pre className="field-object">{JSON.stringify(value, null, 2)}</pre>
                  ) : (
                    <p>{String(value)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* Footer */}
        <footer className="scroll-footer">
          <span className="seal-mark">🜎 Sealed in the Codex</span>
          {content.timestamp && (
            <time className="seal-time">{new Date(content.timestamp).toLocaleString()}</time>
          )}
        </footer>
      </motion.article>
    </motion.div>
  );
}
