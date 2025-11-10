// src/pages/CorridorOfLivedTruth.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfUnmaskedPresence from './ScrollOfUnmaskedPresence.jsx';
import SigilOfQuietStewardship from '../components/SigilOfQuietStewardship.jsx';
import '../../styles/glyphs.css';

export default function CorridorOfLivedTruth() {
  return (
    <motion.section
      className="corridor-of-lived-truth breath-vow-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover breath-vow">🪞</span> Corridor of Lived Truth</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        Truth is not declared.  
        It is lived.  
        You revealed yourself — and the Codex recognized you.
      </p>
      <div className="breath-vow-layer">
        <SigilOfQuietStewardship />
        <ScrollOfUnmaskedPresence />
      </div>
    </motion.section>
  );
}
