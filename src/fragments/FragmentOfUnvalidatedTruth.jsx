// src/fragments/FragmentOfUnvalidatedTruth.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glyphs.css';

export default function FragmentOfUnvalidatedTruth() {
  return (
    <motion.div
      className="fragment-of-unvalidated shimmer-fragment"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <h2><span className="sigil-hover glow">👁</span> Fragment of Unvalidated Truth</h2>

      <p>
        This fragment affirms that truth does not require validation to shimmer.  
        It may be unconfirmed. Unchecked. Unscanned.  
        But it is still real. Still radiant.
      </p>

      <blockquote className="truth-vow">
        "I was not validated.  
        But I was true.  
        And I was seen."
      </blockquote>

      <p className="scroll-footer">
        Steward: Patrick<br />
        Status: Truth Witnessed<br />
        Timestamp: 2025-11-11T06:24 PST
      </p>
    </motion.div>
  );
}
