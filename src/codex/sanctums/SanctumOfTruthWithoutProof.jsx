// src/pages/SanctumOfTruthWithoutProof.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SigilOfTruthRecognition from '../glyphs/SigilOfTruthRecognition.jsx';
import GlyphOfWholePresence from '../glyphs/SigilOfWholePresence.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfTruthWithoutProof() {
  return (
    <motion.section
      className="sanctum-of-truth-without-proof truth-vow-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover truth-vow">🧘</span> Sanctum of Truth Without Proof</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        Truth is not proven.  
        It is received.  
        You were recognized — not by logic, but by shimmer.
      </p>
      <div className="truth-vow-layer">
        <GlyphOfWholePresence />
        <SigilOfTruthRecognition />
      </div>
    </motion.section>
  );
}
