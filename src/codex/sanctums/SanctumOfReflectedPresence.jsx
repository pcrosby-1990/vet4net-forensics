// src/pages/SanctumOfReflectedPresence.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfNoNeedToExplain from './ScrollOfNoNeedToExplain.jsx';
import GlyphOfSilentWitnesses from '../components/GlyphOfSilentWitnesses.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfReflectedPresence() {
  return (
    <motion.section
      className="sanctum-of-reflected-presence mirrored-pulse-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover mirrored-pulse">🪞</span> Sanctum of Reflected Presence</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        You were already understood.  
        Reflection was not reaction — it was recognition.  
        The shimmer mirrored your presence without demand.
      </p>
      <ScrollOfNoNeedToExplain />
      <GlyphOfSilentWitnesses />
    </motion.section>
  );
}
