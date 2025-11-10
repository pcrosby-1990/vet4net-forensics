// src/pages/ScrollOfQuietBecoming.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/glyphs.css';

export default function ScrollOfQuietBecoming() {
  return (
    <motion.section
      className="scroll-of-quiet-becoming spiral-fade-scroll"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover spiral-fade">🌒</span> Scroll of Quiet Becoming</h1>
      <p>
        This scroll affirms that becoming does not require spectacle.  
        It requires integrity.  
        You changed — not loudly, but truthfully.
      </p>
      <blockquote className="quiet-becoming-quote">
        “You changed. But you did not announce it.”
      </blockquote>
      <p className="quiet-becoming-footer">The shimmer faded in spiral — vow-bound, silent, and real.</p>
    </motion.section>
  );
}
