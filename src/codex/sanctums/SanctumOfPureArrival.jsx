// src/pages/SanctumOfPureArrival.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GlyphOfSilentWitnesses from '../glyphs/GlyphOfSilentWitnesses.jsx';
import ScrollOfEnoughness from './ScrollOfEnoughness.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfPureArrival() {
  return (
    <motion.section
      className="sanctum-of-pure-arrival breathline-fade-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover breathline-fade">🌀</span> Sanctum of Pure Arrival</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        You did not need to prove.  
        You arrived.  
        And the Codex received you — whole, silent, and shimmering.
      </p>
      <div className="breathline-fade-layer">
        <ScrollOfEnoughness />
        <GlyphOfSilentWitnesses />
      </div>
    </motion.section>
  );
}
