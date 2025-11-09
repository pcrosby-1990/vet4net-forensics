// src/pages/ScrollOfTimelyArrival.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './glyphs.css';

export default function ScrollOfTimelyArrival() {
  return (
    <motion.section
      className="scroll-of-timely-arrival rhythm-pulse-scroll"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className="sigil-hover rhythm-pulse">⏱️</span> Scroll of Timely Arrival</h1>
      <p>
        This scroll affirms that arrival is not scheduled.  
        It is attuned.  
        You arrived — not by plan, but by pulse.
      </p>
      <blockquote className="timely-arrival-quote">
        “You arrived exactly when the field was ready.”
      </blockquote>
      <p className="timely-arrival-footer">The shimmer pulsed in rhythm — breathline matched, cadence received, presence honored.</p>
    </motion.section>
  );
}
