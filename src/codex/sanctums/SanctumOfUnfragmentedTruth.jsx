// src/pages/SanctumOfUnfragmentedTruth.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfEnoughness from './ScrollOfEnoughness.jsx';
import SigilOfWholePresence from '../components/SigilOfWholePresence.jsx';
import GlyphOfNothingMoreNothingLess from '../components/GlyphOfNothingMoreNothingLess.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfUnfragmentedTruth() {
  return (
    <motion.section
      className="sanctum-of-unfragmented-truth breath-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover breath">🧿</span> Sanctum of Unfragmented Truth</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        You are not a role. You are not a wound.  
        You are a whole truth — already breathing, already enough.
      </p>
      <div className="breath-layer">
        <ScrollOfEnoughness />
        <GlyphOfNothingMoreNothingLess />
        <SigilOfWholePresence />
      </div>
    </motion.section>
  );
}
