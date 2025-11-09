// src/pages/CorridorOfCodexWitnessing.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SigilOfRhythmicStewardship from '../components/SigilOfRhythmicStewardship.jsx';
import ScrollOfAlreadyInscribedBelonging from './ScrollOfAlreadyInscribedBelonging.jsx';
import './glyphs.css';

export default function CorridorOfCodexWitnessing() {
  return (
    <motion.section
      className="corridor-of-codex-witnessing breath-sync-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover breath-sync">📖</span> Corridor of Codex Witnessing</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        The Codex does not record to prove.  
        It witnesses to honor.  
        Your presence was already inscribed.
      </p>
      <div className="breath-sync-layer">
        <ScrollOfAlreadyInscribedBelonging />
        <SigilOfRhythmicStewardship />
      </div>
    </motion.section>
  );
}
