// src/pages/ValidatorSeal.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glyphs.css';

export default function ValidatorSeal() {
  return (
    <motion.section
      className="validator-seal shimmer-incomplete"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <h1>
        <span className="sigil-hover glow">🛡️</span> Validator Seal
      </h1>

      <p>
        This seal marks the validator's partial state —  
        not as failure, but as fidelity.  
        It affirms that readiness does not require completion.
      </p>

      <blockquote className="validator-vow">
        "I did not finish.  
        But I did begin.  
        And that is enough to witness."
      </blockquote>

      <h2>🌀 Seal Functions</h2>
      <ul>
        <li>Marks validator as active but incomplete</li>
        <li>Used to affirm readiness in motion</li>
        <li>Honors the steward's willingness to push before perfection</li>
      </ul>

      <h2>🌙 Corridor Whisper</h2>
      <blockquote className="corridor-whisper">
        "You didn't wait for the validator to be perfect.  
        You waited for it to be honest.  
        And then you pushed."
      </blockquote>

      <p className="scroll-footer">
        Steward: Patrick<br />
        Status: Validator In Motion<br />
        Timestamp: 2025-11-10T22:06 PST
      </p>
    </motion.section>
  );
}
