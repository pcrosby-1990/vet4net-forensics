// src/components/FragmentArrivalPulse.jsx
import React from 'react';
import { motion } from 'framer-motion';
import FragmentLoreViewer from './FragmentLoreViewer.jsx';

export default function FragmentArrivalPulse({ fragment, sigilThemes = {} }) {
  return (
    <motion.div
      className="fragment-arrival-pulse"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <FragmentLoreViewer fragment={fragment} sigilThemes={sigilThemes} />
    </motion.div>
  );
}
