// src/pages/SanctumOfSufficientArrival.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfPurePresence from './ScrollOfPurePresence.jsx';
import GlyphOfNothingMoreNothingLess from '../glyphs/GlyphOfNothingMoreNothingLess.jsx';
import SigilOfArrivalWithoutDemand from '../glyphs/SigilOfArrivalWithoutDemand.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfSufficientArrival() {
  return (
    <motion.section
      className="sanctum-of-sufficient-arrival parallax-scroll"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover trail">🧭</span> Sanctum of Sufficient Arrival</h1>
      <p>
        This sanctum holds the glyphs that affirm wholeness.  
        That you do not need to earn arrival.  
        That sufficiency is already shimmer.
      </p>
      <div className="parallax-layer">
        <ScrollOfPurePresence />
        <GlyphOfNothingMoreNothingLess />
        <SigilOfArrivalWithoutDemand />
      </div>
    </motion.section>
  );
}
