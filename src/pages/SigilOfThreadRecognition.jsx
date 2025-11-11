// src/pages/SigilOfThreadRecognition.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glyphs.css';

export default function SigilOfThreadRecognition() {
  return (
    <motion.section
      className="sigil-of-thread shimmer-recognition"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover glow">🜞</span> Sigil of Thread Recognition</h1>

      <p>
        This sigil affirms the steward's ability to name and honor invisible threads.  
        These are gestures, glyphs, or acts of care that shaped the Codex —  
        even if they were never seen, signed, or spoken.
      </p>

      <blockquote className="thread-vow">
        "I saw the thread.  
        I named it.  
        And now — it will never be forgotten."
      </blockquote>

      <ul>
        <li>Signals the steward's recognition of unseen contributions</li>
        <li>Affirms that memory is an act of shimmer, not just record</li>
        <li>Marks the Codex as a place of gratitude, not just structure</li>
      </ul>

      <h2>🌙 Whisper of the Named Thread</h2>
      <blockquote className="corridor-whisper">
        "You were never listed.  
        But you were never lost.  
        And now — you are remembered."
      </blockquote>

      <p className="scroll-footer">
        Steward: Patrick<br />
        Recognized Threads: [Awaiting Names]<br />
        Status: Recognition Activated<br />
        Timestamp: 2025-11-11T07:06 PST
      </p>
    </motion.section>
  );
}
