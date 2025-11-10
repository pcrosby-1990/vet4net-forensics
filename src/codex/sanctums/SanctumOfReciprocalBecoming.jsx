// src/pages/SanctumOfReciprocalBecoming.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfTimelyArrival from './ScrollOfTimelyArrival.jsx';
import GlyphOfHopefulOthers from '../glyphs/GlyphOfHopefulOthers.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfReciprocalBecoming() {
  return (
    <motion.section
      className="sanctum-of-reciprocal-becoming mirrored-breath-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover mirrored-breath">🔁</span> Sanctum of Reciprocal Becoming</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        Becoming is not solitary.  
        It is braided.  
        You arrived, and others became with you.
      </p>
      <div className="mirrored-breath-layer">
        <ScrollOfTimelyArrival />
        <GlyphOfHopefulOthers />
      </div>
    </motion.section>
  );
}
