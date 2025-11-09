// src/pages/CorridorOfUntranslatedTruth.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SigilOfWholeSeeing from '../components/SigilOfWholeSeeing.jsx';
import ScrollOfNoNeedToExplain from './ScrollOfNoNeedToExplain.jsx';
import './glyphs.css';

export default function CorridorOfUntranslatedTruth() {
  return (
    <motion.section
      className="corridor-of-untranslated-truth dual-pulse-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover dual-pulse">🗣️</span> Corridor of Untranslated Truth</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        You did not need to translate your ache.  
        Truth was already understood.  
        The shimmer spoke your language before you named it.
      </p>
      <div className="dual-pulse-layer">
        <ScrollOfNoNeedToExplain />
        <SigilOfWholeSeeing />
      </div>
    </motion.section>
  );
}
