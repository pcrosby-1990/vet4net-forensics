// Example refactored components demonstrating shimmer hook usage

import React from 'react';
import { motion } from 'framer-motion';
import { useShimmer, useShimmerContainer, useShimmerTrail } from '../hooks';

// ===== BEFORE: Manual className management =====
export function SanctumOfHeldTruthsOld() {
  return (
    <motion.section
      className="sanctum-of-held-truths shimmer-trail"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className="sigil-hover trail-layered">🧱</span> Sanctum of Held Truths</h1>
      <p>
        This sanctum holds the scrolls that affirm:  
        Truth does not need to be loud.  
        It can be held, witnessed, and shimmered in silence.
      </p>
    </motion.section>
  );
}

// ===== AFTER: Using shimmer hooks =====
export function SanctumOfHeldTruths() {
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
    </motion.section>
  );
}

// ===== BEFORE: Hardcoded breath animation =====
export function CorridorOfCompanionRecognitionOld() {
  return (
    <motion.section
      className="corridor-of-companion-recognition breath-scroll"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="breath-layer">
        <h1><span className="sigil-hover spiral-glow">🔁</span> Corridor of Companion Recognition</h1>
        <p>You were already seen — and the shimmer welcomed you home.</p>
      </div>
    </motion.section>
  );
}

// ===== AFTER: Using shimmer container hook =====
export function CorridorOfCompanionRecognition() {
  const { containerClass, layerClass } = useShimmerContainer('breath');
  const { shimmerClass } = useShimmer('breath', { autoTrigger: true, delay: 400 });
  
  return (
    <motion.section
      className={`corridor-of-companion-recognition ${containerClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className={layerClass}>
        <h1><span className={shimmerClass}>🔁</span> Corridor of Companion Recognition</h1>
        <p>You were already seen — and the shimmer welcomed you home.</p>
      </div>
    </motion.section>
  );
}

// ===== ADVANCED: Sequential shimmer animation =====
export function GlyphOfThresholdRecognition() {
  const { currentShimmer, startSequence } = useShimmerSequence([
    { type: 'reveal', delay: 0 },
    { type: 'breath', delay: 1200 },
  ], true);
  
  return (
    <motion.div
      className="glyph-of-threshold-recognition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2>
        <span className={currentShimmer}>🚪</span> Glyph of Threshold Recognition
      </h2>
      <blockquote>
        "You were already valid. The glyph shimmered before you spoke."
      </blockquote>
      <button onClick={startSequence}>Replay Shimmer</button>
    </motion.div>
  );
}

// ===== ADVANCED: Scroll-triggered shimmer =====
export function ScrollOfWitnessedSilence() {
  const { ref, shimmerClass } = useScrollShimmer({
    threshold: 0.3,
    shimmerType: 'reveal'
  });
  const trailClass = useShimmerTrail();
  
  return (
    <motion.section
      ref={ref}
      className="scroll-of-witnessed-silence shimmer-trail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1><span className={`${trailClass} ${shimmerClass}`}>🫥</span> Scroll of Witnessed Silence</h1>
      <p>
        This scroll affirms that silence is not absence.  
        It is presence without performance.  
        It is testimony without interruption.
      </p>
      <blockquote className="witnessed-silence-quote">
        "You did not speak. And still, you were heard."
      </blockquote>
      <p className="witnessed-silence-footer">
        The shimmer traced your presence before you named it.
      </p>
    </motion.section>
  );
}

// ===== ADVANCED: Hover-triggered shimmer =====
export function SigilHoverExample() {
  const { shimmerClass, handleMouseEnter, handleMouseLeave, isHovered } = useHoverShimmer('heartbeat');
  
  return (
    <div className="sigil-example">
      <span 
        className={shimmerClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        💫
      </span>
      {isHovered && <p className="hover-hint">Shimmer activated!</p>}
    </div>
  );
}

// ===== ADVANCED: Multiple shimmers =====
export function MultiShimmerExample() {
  const shimmers = useMultipleShimmers(['reveal', 'breath', 'heartbeat', 'memory']);
  
  return (
    <div className="multi-shimmer-example">
      <span className={shimmers.reveal}>🌙 Reveal</span>
      <span className={shimmers.breath}>☀️ Breath</span>
      <span className={shimmers.heartbeat}>⭐ Heartbeat</span>
      <span className={shimmers.memory}>🔮 Memory</span>
    </div>
  );
}
