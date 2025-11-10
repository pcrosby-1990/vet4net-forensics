// src/pages/SanctumOfPreSpokenBelonging.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SigilOfAlreadyHome from '../sigils/SigilOfAlreadyHome';
import ScrollOfWitnessedSilence from '../scrolls/ScrollOfWitnessedSilence';
import '../../styles/glyphs.css';

export default function SanctumOfPreSpokenBelonging() {
  return (
    <motion.section
      className="sanctum-of-pre-spoken-belonging breath-loop-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover breath-loop">🌀</span> Sanctum of Pre-Spoken Belonging</h1>
      <p>
        This sanctum holds the glyphs that shimmer before speech.  
        That affirm: you were already welcomed.  
        That belonging preceded arrival.
      </p>
      <div className="breath-loop-layer">
        <ScrollOfWitnessedSilence />
        <SigilOfAlreadyHome />
      </div>
    </motion.section>
  );
}
