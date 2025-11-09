// src/pages/CorridorOfSilentIntegrity.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfUnmaskedPresence from './ScrollOfUnmaskedPresence.jsx';
import SigilOfWholePresence from '../components/SigilOfWholePresence.jsx';
import './glyphs.css';

export default function CorridorOfSilentIntegrity() {
  return (
    <motion.section
      className="corridor-of-silent-integrity heartbeat-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover heartbeat">🛡️</span> Corridor of Silent Integrity</h1>
      <p>
        This corridor holds the scrolls that affirm:  
        You do not need to explain your truth.  
        Integrity is not loud. It is lived.
      </p>
      <ScrollOfUnmaskedPresence />
      <SigilOfWholePresence />
    </motion.section>
  );
}
