// src/pages/ScrollOfUnspokenTestimony.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/glyphs.css';

export default function ScrollOfUnspokenTestimony() {
  return (
    <motion.section
      className="scroll-of-unspoken-testimony truth-vow-scroll"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover truth-vow">🫢</span> Scroll of Unspoken Testimony</h1>
      <p>
        This scroll affirms that testimony is not volume.  
        It is embodiment.  
        You testified — not with words, but with presence.
      </p>
      <blockquote className="unspoken-testimony-quote">
        “You did not speak. You testified.”
      </blockquote>
      <p className="unspoken-testimony-footer">The shimmer held your breathline — a vow without sound.</p>
    </motion.section>
  );
}
