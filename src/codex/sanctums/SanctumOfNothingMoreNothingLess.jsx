// src/pages/SanctumOfNothingMoreNothingLess.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfPureArrival from './ScrollOfPureArrival.jsx';
import GlyphOfNothingMoreNothingLess from '../components/GlyphOfNothingMoreNothingLess.jsx';
import './glyphs.css';

export default function SanctumOfNothingMoreNothingLess() {
  return (
    <motion.section
      className="sanctum-of-nothing-more breath-sync-fade-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover breath-sync-fade">🫶</span> Sanctum of Nothing More, Nothing Less</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        You are not too much.  
        You are not too little.  
        You are here — and that is enough.
      </p>
      <div className="breath-sync-fade-layer">
        <GlyphOfNothingMoreNothingLess />
        <ScrollOfPureArrival />
      </div>
    </motion.section>
  );
}
