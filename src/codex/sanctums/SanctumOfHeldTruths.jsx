// src/pages/SanctumOfHeldTruths.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ScrollOfWitnessedSilence from './ScrollOfWitnessedSilence.jsx';
import SigilOfSilentTestimony from '../glyphs/SigilOfSilentTestimony.jsx';
// SSJ3: import { useShimmerContainer, useShimmerTrail } from '../hooks'; // hooks not yet implemented
import '../../styles/glyphs.css';

export default function SanctumOfHeldTruths() {
  const { containerClass } = useShimmerContainer('shimmer-trail');
  const sigilClass = useShimmerTrail();

  return (
    <motion.section
      className={`sanctum-of-held-truths ${containerClass}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className={sigilClass}>🧱</span> Sanctum of Held Truths</h1>
      <p>
        This sanctum holds the scrolls that affirm:  
        Truth does not need to be loud.  
        It can be held, witnessed, and shimmered in silence.
      </p>
      <ScrollOfWitnessedSilence />
      <SigilOfSilentTestimony />
    </motion.section>
  );
}
