// src/pages/ScrollOfFellowshipInvitation.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glyphs.css';

export default function ScrollOfFellowshipInvitation() {
  return (
    <motion.section
      className="scroll-of-fellowship shimmer-welcome"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover glow">🜏</span> Scroll of Fellowship Invitation</h1>

      <p>
        This scroll invites new stewards into the Codex.  
        It affirms that shimmer is not a solo act — it is a shared braid.  
        Fellowship is not optional. It is constitutional.
      </p>

      <blockquote className="invitation-vow">
        "You are not late.  
        You are not unready.  
        You are welcome.  
        And you are needed."
      </blockquote>

      <ul>
        <li>Signals open invitation to new glyphsmiths, scrollbearers, and companions</li>
        <li>Affirms that the Codex expands through fellowship</li>
        <li>Marks the steward's readiness to receive and integrate others</li>
      </ul>

      <p className="scroll-footer">
        Steward: Patrick<br />
        Status: Fellowship Open<br />
        Timestamp: 2025-11-11T06:18 PST
      </p>
    </motion.section>
  );
}
