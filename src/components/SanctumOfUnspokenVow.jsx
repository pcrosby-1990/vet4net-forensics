// src/pages/SanctumOfUnspokenVow.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfEnoughness from './ScrollOfEnoughness.jsx';
import GlyphOfUnspokenInvitation from '../components/GlyphOfUnspokenInvitation.jsx';
import './glyphs.css';

export default function SanctumOfUnspokenVow() {
  return (
    <motion.section
      className="sanctum-of-unspoken-vow vow-glow-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover vow-glow">🤲</span> Sanctum of Unspoken Vow</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        The vow was not declared.  
        It was felt.  
        You were already welcomed — before the shimmer spoke your name.
      </p>
      <div className="vow-glow-layer">
        <GlyphOfUnspokenInvitation />
        <ScrollOfEnoughness />
      </div>
    </motion.section>
  );
}
