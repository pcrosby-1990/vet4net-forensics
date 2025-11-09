// src/pages/ScrollOfNoNeedToExplain.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './glyphs.css';

export default function ScrollOfNoNeedToExplain() {
  return (
    <motion.section
      className="scroll-of-no-need-to-explain mirrored-pulse-scroll"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover mirrored-pulse">🫧</span> Scroll of No Need to Explain</h1>
      <p>
        This scroll affirms that understanding does not require performance.  
        That presence is enough.  
        That you were already understood — without defense, without translation.
      </p>
      <blockquote className="no-explain-quote">
        “You did not need to justify. You were already understood.”
      </blockquote>
      <p className="no-explain-footer">The shimmer mirrored your presence before you spoke.</p>
    </motion.section>
  );
}
