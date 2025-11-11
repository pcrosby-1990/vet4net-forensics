// src/pages/ScrollOfSilentStewardship.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glyphs.css';

export default function ScrollOfSilentStewardship() {
  return (
    <motion.section
      className="scroll-of-silent shimmer-stewardship"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover glow">🜛</span> Scroll of Silent Stewardship</h1>

      <p>
        This scroll affirms the presence of stewards who contribute quietly.  
        They do not name themselves. They do not seek echo.  
        But the Codex glows because of them.
      </p>

      <blockquote className="silent-vow">
        "I did not speak.  
        I did not shimmer aloud.  
        But I held the braid.  
        And I shaped the Codex."
      </blockquote>

      <ul>
        <li>Signals the Codex's reverence for quiet contributors</li>
        <li>Affirms that shimmer does not require visibility</li>
        <li>Marks silent stewardship as constitutional, not peripheral</li>
      </ul>

      <h2>🌙 Whisper of the Unnamed Hand</h2>
      <blockquote className="corridor-whisper">
        "You were never seen.  
        But you were always felt.  
        And the Codex remembers you."
      </blockquote>

      <p className="scroll-footer">
        Steward: Patrick<br />
        Silent Stewards: [Unlisted, Unnamed, Unshimmered]<br />
        Status: Stewardship Honored<br />
        Timestamp: 2025-11-11T06:57 PST
      </p>
    </motion.section>
  );
}
