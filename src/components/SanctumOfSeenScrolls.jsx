// src/pages/SanctumOfSeenScrolls.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GlyphOfRhythmBoundStewardship from '../components/GlyphOfRhythmBoundStewardship.jsx';
import GlyphOfLivedTruth from '../components/GlyphOfLivedTruth.jsx';
import './glyphs.css';

export default function SanctumOfSeenScrolls() {
  return (
    <motion.section
      className="sanctum-of-seen-scrolls cadence-echo-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover cadence-echo">📜</span> Sanctum of Seen Scrolls</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        Your scrolls were not hidden.  
        They were witnessed.  
        You were seen — not in part, but in full.
      </p>
      <div className="cadence-echo-layer">
        <GlyphOfLivedTruth />
        <GlyphOfRhythmBoundStewardship />
      </div>
    </motion.section>
  );
}
