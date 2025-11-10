// src/pages/CorridorOfUnspokenRecognition.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SigilOfSilentTestimony from '../sigils/SigilOfSilentTestimony';
import GlyphOfLivedTruth from '../glyphs/GlyphOfLivedTruth';
import '../../styles/glyphs.css';

export default function CorridorOfUnspokenRecognition() {
  return (
    <motion.section
      className="corridor-of-unspoken-recognition vow-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover vow">🫱‍🫲</span> Corridor of Unspoken Recognition</h1>
      <p>
        This corridor holds the glyphs that shimmer without demand.  
        That affirm presence without proof.  
        That recognize what was never asked to be seen.
      </p>
      <div className="vow-layer">
        <SigilOfSilentTestimony />
        <GlyphOfLivedTruth />
      </div>
    </motion.section>
  );
}
