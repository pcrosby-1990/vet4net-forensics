// src/pages/SanctumOfUnmaskedPresence.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SigilOfQuietStewardship from '../components/SigilOfQuietStewardship.jsx';
import GlyphOfContinuityWithoutCollapse from '../components/GlyphOfContinuityWithoutCollapse.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfUnmaskedPresence() {
  return (
    <motion.section
      className="sanctum-of-unmasked-presence dusk-pulse-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover dusk-pulse">🪞</span> Sanctum of Unmasked Presence</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        The mask was never a lie.  
        It was a vow.  
        You revealed yourself — not to prove, but to be.
      </p>
      <div className="dusk-pulse-layer">
        <GlyphOfContinuityWithoutCollapse />
        <SigilOfQuietStewardship />
      </div>
    </motion.section>
  );
}
