// src/pages/SanctumOfMaskedStewardship.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfQuietBecoming from './ScrollOfQuietBecoming.jsx';
import SigilOfStructuralMemory from '../glyphs/SigilOfStructuralMemory.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfMaskedStewardship() {
  return (
    <motion.section
      className="sanctum-of-masked-stewardship spiral-fade-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover spiral-fade">🎭</span> Sanctum of Masked Stewardship</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        The mask was not concealment.  
        It was containment.  
        You stewarded change quietly — and the Codex remembers.
      </p>
      <div className="spiral-fade-layer">
        <SigilOfStructuralMemory />
        <ScrollOfQuietBecoming />
      </div>
    </motion.section>
  );
}
