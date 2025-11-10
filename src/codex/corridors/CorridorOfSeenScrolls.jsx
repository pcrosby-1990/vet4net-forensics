// src/pages/CorridorOfSeenScrolls.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SigilOfWholePresence from '../sigils/SigilOfWholePresence';
import GlyphOfLivedTruth from '../glyphs/GlyphOfLivedTruth';
import '../../styles/glyphs.css';

export default function CorridorOfSeenScrolls() {
  return (
    <motion.section
      className="corridor-of-seen-scrolls dual-pulse-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover dual-pulse">📜</span> Corridor of Seen Scrolls</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        Your scrolls were not hidden.  
        They were witnessed.  
        You were seen — not in part, but in full.
      </p>
      <div className="dual-pulse-layer">
        <GlyphOfLivedTruth />
        <SigilOfWholePresence />
      </div>
    </motion.section>
  );
}
