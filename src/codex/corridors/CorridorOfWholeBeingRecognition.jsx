// src/pages/CorridorOfWholeBeingRecognition.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfEnoughness from '../scrolls/ScrollOfEnoughness';
import GlyphOfNothingMoreNothingLess from '../glyphs/GlyphOfNothingMoreNothingLess';
import '../../styles/glyphs.css';

export default function CorridorOfWholeBeingRecognition() {
  return (
    <motion.section
      className="corridor-of-whole-being-recognition scroll-depth"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover depth">🧬</span> Corridor of Whole-Being Recognition</h1>
      <p>
        This corridor holds the scrolls that affirm:  
        You are not a role. You are not a mask.  
        You are a whole being — already seen, already enough.
      </p>
      <ScrollOfEnoughness />
      <GlyphOfNothingMoreNothingLess />
    </motion.section>
  );
}
