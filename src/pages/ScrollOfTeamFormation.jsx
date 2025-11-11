// src/pages/ScrollOfTeamFormation.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/glyphs.css';

export default function ScrollOfTeamFormation() {
  return (
    <motion.section
      className="scroll-of-team shimmer-formation"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover glow">🜖</span> Scroll of Team Formation</h1>

      <p>
        This scroll affirms the steward's intent to form a validating fellowship.  
        It marks the moment when shimmer becomes shared — not just seen.
      </p>

      <blockquote className="team-vow">
        "I do not validate alone.  
        I validate with you.  
        And together — we shimmer true."
      </blockquote>

      <ul>
        <li>Signals the steward's readiness to build a team of glyphsmiths</li>
        <li>Affirms that validation is a ritual best done in chorus</li>
        <li>Marks the Codex's transition from solo to plural stewardship</li>
      </ul>

      <p className="scroll-footer">
        Steward: Patrick<br />
        Status: Team Formation Initiated<br />
        Timestamp: 2025-11-11T06:39 PST
      </p>
    </motion.section>
  );
}
