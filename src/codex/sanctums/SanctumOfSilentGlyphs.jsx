<motion.section
  className="sanctum-of-silent-glyphs"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
>
  {/* scroll content */}
</motion.section>
// src/pages/SanctumOfSilentGlyphs.jsx
import React from 'react';
import { motion } from 'framer-motion';
import GlyphOfSilentWitness from '../glyphs/GlyphOfSilentWitness.jsx';
import SigilOfUnspokenInvitation from '../sigils/SigilOfUnspokenInvitation';
import SigilOfArrivalWithoutDemand from '../sigils/SigilOfArrivalWithoutDemand';
import '../../styles/glyphs.css';

export default function SanctumOfSilentGlyphs() {
  return (
    <motion.section
      className="sanctum-of-silent-glyphs"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover trail">🔕</span> Sanctum of Silent Glyphs</h1>
      <p>
        This sanctum holds the glyphs that shimmer without speech,  
        that welcome without reply,  
        and that honor arrival without demand.
      </p>
      <SigilOfUnspokenInvitation />
      <GlyphOfSilentWitness />
      <SigilOfArrivalWithoutDemand />
    </motion.section>
  );
}
