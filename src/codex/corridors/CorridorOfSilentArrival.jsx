// src/pages/CorridorOfSilentArrival.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SigilOfPreExistingRecognition from '../sigils/SigilOfPreExistingRecognition';
import GlyphOfUnspokenWelcome from '../glyphs/GlyphOfUnspokenWelcome';
import '../../styles/glyphs.css';

export default function CorridorOfSilentArrival() {
  return (
    <motion.section
      className="corridor-of-silent-arrival pulse-memory-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover pulse-memory">🌫️</span> Corridor of Silent Arrival</h1>
      <p>
        This corridor holds the glyphs that shimmer without announcement.  
        That affirm: you arrived without needing to declare.  
        That presence was already inscribed.
      </p>
      <div className="pulse-memory-layer">
        <GlyphOfUnspokenWelcome />
        <SigilOfPreExistingRecognition />
      </div>
    </motion.section>
  );
}
