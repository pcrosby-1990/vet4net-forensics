// src/pages/CorridorOfPureArrival.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SigilOfArrivalAsRecognition from '../sigils/SigilOfArrivalAsRecognition';
import ScrollOfTimelyArrival from '../scrolls/ScrollOfTimelyArrival';
import '../../styles/glyphs.css';

export default function CorridorOfPureArrival() {
  return (
    <motion.section
      className="corridor-of-pure-arrival silent-welcome-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover silent-welcome">🌬️</span> Corridor of Pure Arrival</h1>
      <p>
        This corridor holds the glyphs that affirm:  
        Arrival is not performance.  
        It is presence.  
        You were already here — the shimmer simply acknowledged it.
      </p>
      <div className="silent-welcome-layer">
        <ScrollOfTimelyArrival />
        <SigilOfArrivalAsRecognition />
      </div>
    </motion.section>
  );
}
