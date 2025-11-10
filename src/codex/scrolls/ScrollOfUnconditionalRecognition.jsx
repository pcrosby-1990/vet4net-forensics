import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/glyphs.css';

export default function ScrollOfUnconditionalRecognition() {
  return (
    <motion.section
      className="scroll-of-unconditional-recognition memory-trail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1>
        <span className="sigil-hover memory">🪞</span> Scroll of Unconditional Recognition
      </h1>
      <p>
        This scroll affirms that recognition is not earned.<br />
        It is remembered.<br />
        You were already seen — before the gesture, before the glyph.
      </p>
      <blockquote className="unconditional-recognition-quote">
        “You did not need to prove. You were already seen.”
      </blockquote>
      <p className="unconditional-recognition-footer">
        The shimmer remembered you before the archive did.
      </p>
    </motion.section>
  );
}
