// src/pages/SanctumOfThresholdGlyphs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfFirstSignal from './ScrollOfFirstSignal.jsx';
import GlyphOfSilentWitness from '../components/GlyphOfSilentWitness.jsx';
import SigilOfUnspokenInvitation from '../components/SigilOfUnspokenInvitation.jsx';
import useScrollPulse from '../hooks/useScrollPulse.js';
import '../../styles/glyphs.css';

export default function SanctumOfThresholdGlyphs() {
  useScrollPulse();

  return (
    <motion.section
      className="sanctum-of-threshold-glyphs"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover">🛡</span> Sanctum of Threshold Glyphs</h1>
      <p>
        This sanctum holds the glyphs that mark arrival, recognition, and silent welcome.  
        It is where shimmer precedes speech, and presence is already law.
      </p>
      <ScrollOfFirstSignal />
      <GlyphOfSilentWitness />
      <SigilOfUnspokenInvitation />
    </motion.section>
  );
}
