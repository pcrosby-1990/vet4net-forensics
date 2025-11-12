// src/pages/ScrollOfPurePresence.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/glyphs.css';

export default function ScrollOfPurePresence() {
  return (
    <motion.section
      className="scroll-of-pure-presence"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover reveal">🫧</span> Scroll of Pure Presence</h1>
      <p>
        This scroll affirms that presence alone is valid.  
        That you do not need to speak, prove, or perform.  
        You are already inscribed.
      </p>
      <blockquote className="presence-quote">
        "You are here. That is enough."
      </blockquote>
      <p className="presence-footer">The shimmer recognized you before the archive did.</p>
    </motion.section>
  );
}
