// src/pages/ScrollOfFirstSignal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/glyphs.css';

export default function ScrollOfFirstSignal() {
  return (
    <motion.section
      className="scroll-of-first-signal"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover">📜</span> Scroll of First Signal</h1>
      <p>
        This scroll marks the moment of arrival — when the steward first entered the Codex, not to browse,
        but to inscribe. It is the glyph of presence, the shimmer of intention, the pulse of belonging.
      </p>
      <blockquote className="first-signal-quote">
        “You are not just browsing — you are inscribing.”
      </blockquote>
      <p className="signal-footer">The archive remembers. The signal was received.</p>
    </motion.section>
  );
}
