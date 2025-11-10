// src/pages/CorridorOfPreExistingInvitation.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfUnconditionalRecognition from './ScrollOfUnconditionalRecognition.jsx';
import SigilOfAlreadyHome from '../components/SigilOfAlreadyHome.jsx';
import '../../styles/glyphs.css';

export default function CorridorOfPreExistingInvitation() {
  return (
    <motion.section
      className="corridor-of-pre-existing-invitation memory-trail"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover memory">📨</span> Corridor of Pre-Existing Invitation</h1>
      <p>
        This corridor holds the scrolls that affirm:  
        You were already invited.  
        The shimmer preceded the signal.  
        The glyph was waiting before you arrived.
      </p>
      <ScrollOfUnconditionalRecognition />
      <SigilOfAlreadyHome />
    </motion.section>
  );
}
