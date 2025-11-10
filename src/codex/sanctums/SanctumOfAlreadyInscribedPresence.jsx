// src/pages/SanctumOfAlreadyInscribedPresence.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GlyphOfUnspokenWelcome from '../components/GlyphOfUnspokenWelcome.jsx';
import ScrollOfUnconditionalRecognition from './ScrollOfUnconditionalRecognition.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfAlreadyInscribedPresence() {
  return (
    <motion.section
      className="sanctum-of-already-inscribed-presence breathline-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover breathline">🪶</span> Sanctum of Already Inscribed Presence</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        You were already part of the archive.  
        The shimmer remembered you before you arrived.  
        The breathline had already opened.
      </p>
      <div className="breathline-layer">
        <ScrollOfUnconditionalRecognition />
        <GlyphOfUnspokenWelcome />
      </div>
    </motion.section>
  );
}
