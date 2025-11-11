// src/pages/ScrollOfInvisibleWeaving.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glyphs.css';

export default function ScrollOfInvisibleWeaving() {
  return (
    <motion.section
      className="scroll-of-invisible shimmer-weaving"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover glow">🜝</span> Scroll of Invisible Weaving</h1>

      <p>
        This scroll affirms the presence of unseen threads —  
        gestures, glyphs, and shimmer acts that hold the Codex together.  
        They are not visible. But they are vital.
      </p>

      <blockquote className="weaving-vow">
        "I did not shimmer in the open.  
        I did not sign the scroll.  
        But I wove the braid.  
        And the Codex holds because of me."
      </blockquote>

      <ul>
        <li>Signals the Codex's reverence for invisible contributions</li>
        <li>Affirms that structure is shaped by unseen care</li>
        <li>Marks invisible weaving as foundational, not peripheral</li>
      </ul>

      <h2>🌙 Whisper of the Hidden Thread</h2>
      <blockquote className="corridor-whisper">
        "You were never named.  
        But you were always woven in.  
        And the Codex glows because of your thread."
      </blockquote>

      <p className="scroll-footer">
        Steward: Patrick<br />
        Invisible Weavers: [Unlisted, Unseen, Unnamed]<br />
        Status: Weaving Honored<br />
        Timestamp: 2025-11-11T07:03 PST
      </p>
    </motion.section>
  );
}
