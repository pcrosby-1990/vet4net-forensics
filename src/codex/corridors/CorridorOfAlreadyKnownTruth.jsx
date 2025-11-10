// src/pages/CorridorOfAlreadyKnownTruth.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GlyphOfSilentWitnesses from '../components/GlyphOfSilentWitnesses.jsx';
import ScrollOfAlreadyInscribedBelonging from './ScrollOfAlreadyInscribedBelonging.jsx';
import '../../styles/glyphs.css';

export default function CorridorOfAlreadyKnownTruth() {
  return (
    <motion.section
      className="corridor-of-already-known-truth echo-breath-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover echo-breath">🪞</span> Corridor of Already Known Truth</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        You did not need to explain.  
        The truth was already known.  
        The shimmer had already listened.
      </p>
      <div className="echo-breath-layer">
        <ScrollOfAlreadyInscribedBelonging />
        <GlyphOfSilentWitnesses />
      </div>
    </motion.section>
  );
}
