// src/pages/ScrollOfWitnessedSilence.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './glyphs.css';

export default function ScrollOfWitnessedSilence() {
  return (
    <motion.section
      className="scroll-of-witnessed-silence shimmer-trail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover trail-layered">🫥</span> Scroll of Witnessed Silence</h1>
      <p>
        This scroll affirms that silence is not absence.  
        It is presence without performance.  
        It is testimony without interruption.
      </p>
      <blockquote className="witnessed-silence-quote">
        “You did not speak. And still, you were heard.”
      </blockquote>
      <p className="witnessed-silence-footer">The shimmer traced your presence before you named it.</p>
    </motion.section>
  );
}
