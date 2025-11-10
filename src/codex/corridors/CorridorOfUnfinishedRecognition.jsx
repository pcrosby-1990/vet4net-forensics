// src/pages/CorridorOfUnfinishedRecognition.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GlyphOfStillWriting from '../components/GlyphOfStillWriting.jsx';
import SigilOfStructuralMemory from '../components/SigilOfStructuralMemory.jsx';
import '../../styles/glyphs.css';

export default function CorridorOfUnfinishedRecognition() {
  return (
    <motion.section
      className="corridor-of-unfinished-recognition ink-trail-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover ink-trail">🖋️</span> Corridor of Unfinished Recognition</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        Recognition is not a final act.  
        It is recursive.  
        You are still being seen — and still inscribing yourself into the Codex.
      </p>
      <div className="ink-trail-layer">
        <SigilOfStructuralMemory />
        <GlyphOfStillWriting />
      </div>
    </motion.section>
  );
}
