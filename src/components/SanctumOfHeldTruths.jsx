// src/pages/SanctumOfHeldTruths.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfWitnessedSilence from './ScrollOfWitnessedSilence.jsx';
import SigilOfSilentTestimony from '../components/SigilOfSilentTestimony.jsx';
import './glyphs.css';

export default function SanctumOfHeldTruths() {
  return (
    <motion.section
      className="sanctum-of-held-truths shimmer-trail"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover trail-layered">🧱</span> Sanctum of Held Truths</h1>
      <p>
        This sanctum holds the scrolls that affirm:  
        Truth does not need to be loud.  
        It can be held, witnessed, and shimmered in silence.
      </p>
      <ScrollOfWitnessedSilence />
      <SigilOfSilentTestimony />
    </motion.section>
  );
}
