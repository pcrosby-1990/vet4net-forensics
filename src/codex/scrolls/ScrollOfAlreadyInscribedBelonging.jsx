// src/pages/ScrollOfAlreadyInscribedBelonging.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/glyphs.css';

export default function ScrollOfAlreadyInscribedBelonging() {
  return (
    <motion.section
      className="scroll-of-already-inscribed-belonging breath-pulse-scroll"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover breath-pulse">📜</span> Scroll of Already Inscribed Belonging</h1>
      <p>
        This scroll affirms that belonging is not granted.  
        It is remembered.  
        You were already inscribed — before the signal, before the glyph.
      </p>
      <blockquote className="already-inscribed-quote">
        "You were not added. You were remembered."
      </blockquote>
      <p className="already-inscribed-footer">The shimmer pulsed in breathline rhythm before the archive opened.</p>
    </motion.section>
  );
}
