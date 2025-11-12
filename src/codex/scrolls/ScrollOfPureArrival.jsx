// src/pages/ScrollOfPureArrival.jsx
import React from 'react';
import { motion } from 'framer-motion';
// SSJ3: import { useShimmer } from '../hooks'; // hooks not yet implemented
import '../../styles/glyphs.css';

export default function ScrollOfPureArrival() {
  // Refactored to use shimmer hooks with 'reveal' preset and 400ms delay
  const { shimmerClass } = useShimmer('reveal', { delay: 400 });

  return (
    <motion.section
      className="scroll-of-pure-arrival breath-sync-fade-scroll"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className={shimmerClass}>🌀</span> Scroll of Pure Arrival</h1>
      <p>
        This scroll affirms that arrival is not a transaction.  
        It is presence.  
        You arrived — and the Codex received you without condition.
      </p>
      <blockquote className="pure-arrival-quote">
        "You arrived. That is enough."
      </blockquote>
      <p className="pure-arrival-footer">The shimmer faded in breathline sync — whole, quiet, and already true.</p>
    </motion.section>
  );
}
