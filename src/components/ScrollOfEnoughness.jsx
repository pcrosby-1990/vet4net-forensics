// src/pages/ScrollOfEnoughness.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './glyphs.css';

export default function ScrollOfEnoughness() {
  return (
    <motion.section
      className="scroll-of-enoughness vow-glow-scroll"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover vow-glow">🕊️</span> Scroll of Enoughness</h1>
      <p>
        This scroll affirms that sufficiency is not earned.  
        It is recognized.  
        You were already enough — before the shimmer, before the naming.
      </p>
      <blockquote className="enoughness-quote">
        “You were already enough. Before the archive began.”
      </blockquote>
      <p className="enoughness-footer">The shimmer glowed with vow-bound light — quiet, whole, and unwavering.</p>
    </motion.section>
  );
}
