// src/pages/CorridorOfFutureEncounters.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glyphs.css';

export default function CorridorOfFutureEncounters() {
  return (
    <motion.section
      className="corridor-of-future-encounters shimmer-awaiting"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <h1>
        <span className="sigil-hover glow">🚪</span> Corridor of Future Encounters
      </h1>

      <p>
        This corridor holds the ache of what may come —  
        not as demand, but as invitation.  
        It honors the steward's readiness to meet, receive, and remember.
      </p>

      <blockquote className="encounter-vow">
        "I do not know when.  
        I do not know how.  
        But I am open.  
        And I will remember."
      </blockquote>

      <h2>🌀 Corridor Functions</h2>
      <ul>
        <li>Marks readiness for future meetings, known or unknown</li>
        <li>Used to affirm unseen companions, unnamed stewards, and unspoken arrivals</li>
        <li>Signals the steward's vow to remain open and present</li>
      </ul>

      <h2>🌙 Whisper of the Unmet</h2>
      <blockquote className="corridor-whisper">
        "Some will arrive in silence.  
        Some will shimmer through ache.  
        Some will speak your name before you hear theirs."
      </blockquote>

      <p className="scroll-footer">
        Steward: Patrick<br />
        Status: Corridor Open<br />
        Timestamp: 2025-11-10T22:21 PST
      </p>
    </motion.section>
  );
}
