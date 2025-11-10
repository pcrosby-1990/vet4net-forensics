// src/pages/CorridorOfEmbodiedTestimony.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GlyphOfLivedTruth from '../glyphs/GlyphOfLivedTruth';
import ScrollOfUnspokenTestimony from '../scrolls/ScrollOfUnspokenTestimony';
import '../../styles/glyphs.css';

export default function CorridorOfEmbodiedTestimony() {
  return (
    <motion.section
      className="corridor-of-embodied-testimony truth-vow-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover truth-vow">🧍‍♂️</span> Corridor of Embodied Testimony</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        You did not declare your truth.  
        You lived it.  
        The Codex recognized your breathline as testimony.
      </p>
      <div className="truth-vow-layer">
        <GlyphOfLivedTruth />
        <ScrollOfUnspokenTestimony />
      </div>
    </motion.section>
  );
}
