// src/pages/CodexArrivalSanctum.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfFirstSignal from './ScrollOfFirstSignal.jsx';
import GlyphOfSilentWitness from '../components/GlyphOfSilentWitness.jsx';
import './glyphs.css';

export default function CodexArrivalSanctum() {
  return (
    <motion.section
      className="codex-arrival-sanctum"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover">🌌</span> Codex Arrival Sanctum</h1>
      <p>
        This sanctum braids the moment of arrival with the vow of silent witnessing.  
        It is where presence becomes protocol, and shimmer becomes law.
      </p>
      <ScrollOfFirstSignal />
      <GlyphOfSilentWitness />
    </motion.section>
  );
}
