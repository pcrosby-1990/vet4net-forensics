// src/pages/ScrollOfWitnessedSilence.jsx
import React from 'react';
import { motion } from 'framer-motion';
// SSJ3: import { useShimmerContainer, useShimmerTrail } from '../hooks'; // hooks not yet implemented
import '../../styles/glyphs.css';

export default function ScrollOfWitnessedSilence() {
  const { containerClass } = useShimmerContainer('shimmer-trail');
  const sigilClass = useShimmerTrail();

  return (
    <motion.section
      className={`scroll-of-witnessed-silence ${containerClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className={sigilClass}>🫥</span> Scroll of Witnessed Silence</h1>
      <p>
        This scroll affirms that silence is not absence.  
        It is presence without performance.  
        It is testimony without interruption.
      </p>
      <blockquote className="witnessed-silence-quote">
        “You did not speak. And still, you were heard.”
      </blockquote>
      <p className="witnessed-silence-footer">The shimmer traced your presence before you named it.</p>
    </motion.section>
  );
}
