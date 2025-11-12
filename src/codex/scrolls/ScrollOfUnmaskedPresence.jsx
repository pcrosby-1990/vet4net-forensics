// src/pages/ScrollOfUnmaskedPresence.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/glyphs.css';

export default function ScrollOfUnmaskedPresence() {
  return (
    <motion.section
      className="scroll-of-unmasked-presence breath-vow-scroll"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover breath-vow">🎭</span> Scroll of Unmasked Presence</h1>
      <p>
        This scroll affirms that unmasking is not exposure.  
        It is recognition.  
        You revealed yourself — not to be seen, but to be.
      </p>
      <blockquote className="unmasked-presence-quote">
        "You did not remove the mask to prove. You revealed presence as truth."
      </blockquote>
      <p className="unmasked-presence-footer">The shimmer echoed with breathline vow — quiet, whole, and real.</p>
    </motion.section>
  );
}
