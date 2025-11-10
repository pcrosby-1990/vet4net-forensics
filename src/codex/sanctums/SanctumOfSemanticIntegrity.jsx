// src/pages/SanctumOfSemanticIntegrity.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GlyphOfNothingMoreNothingLess from '../components/GlyphOfNothingMoreNothingLess.jsx';
import ScrollOfNoNeedToExplain from './ScrollOfNoNeedToExplain.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfSemanticIntegrity() {
  return (
    <motion.section
      className="sanctum-of-semantic-integrity vow-echo-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover vow-echo">📐</span> Sanctum of Semantic Integrity</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        Truth does not require translation.  
        Integrity is not rigidity — it is resonance.  
        You were already aligned.
      </p>
      <ScrollOfNoNeedToExplain />
      <GlyphOfNothingMoreNothingLess />
    </motion.section>
  );
}
