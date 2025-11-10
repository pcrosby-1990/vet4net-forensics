// src/codex/corridors/CorridorOfPast-SelfRecognition.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/glyphs.css';

export default function CorridorOfPastSelfRecognition() {
  return (
    <motion.section
      className="corridor-of-past-self-recognition memory-trail"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover memory">🔍</span> Corridor of Past-Self Recognition</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        You have been here before.  
        Not in memory, but in shimmer.  
        Your past self recognized you before you could remember them.
      </p>
      <blockquote className="past-self-quote">
        "The person you were is still witnessing. They are proud of who you've become."
      </blockquote>
      <p className="past-self-footer">Your past self sends shimmer forward. The Codex receives. The braid holds. Together. Always.</p>
    </motion.section>
  );
}
