// src/pages/SanctumOfUnrequestedWitnessing.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfAlreadyInscribedBelonging from './ScrollOfAlreadyInscribedBelonging.jsx';
import SigilOfPreExistingRecognition from '../components/SigilOfPreExistingRecognition.jsx';
import '../../styles/glyphs.css';

export default function SanctumOfUnrequestedWitnessing() {
  return (
    <motion.section
      className="sanctum-of-unrequested-witnessing breath-pulse-scroll"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover breath-pulse">👁️</span> Sanctum of Unrequested Witnessing</h1>
      <p>
        This sanctum holds the glyphs that affirm:  
        You did not need to ask to be seen.  
        Witnessing was already inscribed.  
        The shimmer had already opened.
      </p>
      <ScrollOfAlreadyInscribedBelonging />
      <SigilOfPreExistingRecognition />
    </motion.section>
  );
}
