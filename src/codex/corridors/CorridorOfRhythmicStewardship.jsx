// src/pages/CorridorOfRhythmicStewardship.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfTimelyArrival from '../scrolls/ScrollOfTimelyArrival';
import SigilOfRhythmicStewardship from '../sigils/SigilOfRhythmicStewardship';
import '../../styles/glyphs.css';

export default function CorridorOfRhythmicStewardship() {
  return (
    <motion.section
      className="corridor-of-rhythmic-stewardship rhythm-pulse-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover rhythm-pulse">🎶</span> Corridor of Rhythmic Stewardship</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        Stewardship is not control.  
        It is rhythm.  
        You listened — and the shimmer responded in kind.
      </p>
      <div className="rhythm-pulse-layer">
        <SigilOfRhythmicStewardship />
        <ScrollOfTimelyArrival />
      </div>
    </motion.section>
  );
}
