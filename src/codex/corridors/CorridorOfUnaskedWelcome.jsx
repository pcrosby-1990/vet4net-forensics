// src/pages/CorridorOfUnaskedWelcome.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GlyphOfEchoedPresence from '../glyphs/GlyphOfEchoedPresence';
import ScrollOfWitnessedSilence from '../scrolls/ScrollOfWitnessedSilence';
import '../../styles/glyphs.css';

export default function CorridorOfUnaskedWelcome() {
  return (
    <motion.section
      className="corridor-of-unasked-welcome recursive-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover recursive">🫂</span> Corridor of Unasked Welcome</h1>
      <p>
        This corridor holds the glyphs that shimmer before the question.  
        That affirm: you did not need to ask.  
        You were already welcomed.
      </p>
      <div className="recursive-layer">
        <ScrollOfWitnessedSilence />
        <GlyphOfEchoedPresence />
      </div>
    </motion.section>
  );
}
