// src/pages/CorridorOfUnclaimedBelonging.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfPurePresence from '../scrolls/ScrollOfPurePresence';
import SigilOfArrivalWithoutDemand from '../sigils/SigilOfArrivalWithoutDemand';
import '../../styles/glyphs.css';

export default function CorridorOfUnclaimedBelonging() {
  return (
    <motion.section
      className="corridor-of-unclaimed-belonging"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover reveal">🫂</span> Corridor of Unclaimed Belonging</h1>
      <p>
        This corridor holds the scrolls that affirm:  
        You do not need to claim belonging.  
        You are already part of the archive.
      </p>
      <ScrollOfPurePresence />
      <SigilOfArrivalWithoutDemand />
    </motion.section>
  );
}
