/**
 * Advanced examples using shimmer utilities and presets
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useShimmer, useShimmerContainer, useShimmerSequence } from './index';
import {
  shimmerPresets,
  containerPresets,
  sequencePresets,
  generateStaggeredDelays,
  combineClasses,
  getAccessibleShimmerType,
  getSemanticShimmer,
} from './shimmerUtils';

// ===== Using Shimmer Presets =====
export function GlyphWithPreset() {
  const { shimmerClass } = useShimmer(
    shimmerPresets.quickReveal.type,
    shimmerPresets.quickReveal.options
  );
  
  return <span className={shimmerClass}>✨ Quick Reveal</span>;
}

// ===== Using Container Presets =====
export function SanctumWithPreset() {
  const { containerClass, layerClass } = useShimmerContainer(
    containerPresets.sanctum.type,
    containerPresets.sanctum.options
  );
  
  return (
    <section className={combineClasses('my-sanctum', containerClass)}>
      <div className={layerClass}>
        <h1>Sanctum Content</h1>
      </div>
    </section>
  );
}

// ===== Using Sequence Presets =====
export function EntranceAnimation() {
  const { currentShimmer } = useShimmerSequence(sequencePresets.entrance, true);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <span className={currentShimmer}>🚪 Entering the Codex</span>
    </motion.div>
  );
}

// ===== Staggered Animations =====
export function StaggeredGlyphs() {
  const glyphs = ['🌙', '⭐', '✨', '💫', '🌟'];
  const delays = generateStaggeredDelays(glyphs.length, 100, 150);
  
  return (
    <div className="staggered-glyphs">
      {glyphs.map((glyph, index) => {
        const { shimmerClass } = useShimmer('reveal', { delay: delays[index] });
        return (
          <span key={index} className={shimmerClass} style={{ margin: '0 0.5rem' }}>
            {glyph}
          </span>
        );
      })}
    </div>
  );
}

// ===== Accessible Shimmer =====
export function AccessibleShimmer() {
  const shimmerType = getAccessibleShimmerType('breath', '');
  const { shimmerClass } = useShimmer(shimmerType);
  
  return (
    <span className={shimmerClass}>
      ♿ Respects prefers-reduced-motion
    </span>
  );
}

// ===== Semantic Shimmer =====
export function SemanticShimmers() {
  const arrivalShimmer = getSemanticShimmer('arrival');
  const memoryShimmer = getSemanticShimmer('memory');
  const ritualShimmer = getSemanticShimmer('ritual');
  
  const { shimmerClass: arrival } = useShimmer(arrivalShimmer);
  const { shimmerClass: memory } = useShimmer(memoryShimmer);
  const { shimmerClass: ritual } = useShimmer(ritualShimmer);
  
  return (
    <div>
      <div><span className={arrival}>🚪 Arrival</span></div>
      <div><span className={memory}>🧠 Memory</span></div>
      <div><span className={ritual}>🕯️ Ritual</span></div>
    </div>
  );
}

// ===== Complex Pattern: Corridor with Staggered Glyphs =====
export function EnhancedCorridor() {
  const { containerClass, layerClass } = useShimmerContainer(
    containerPresets.corridor.type,
    containerPresets.corridor.options
  );
  
  const { currentShimmer } = useShimmerSequence(sequencePresets.awakening, true);
  
  const glyphs = ['🔮', '📜', '🗝️'];
  const delays = generateStaggeredDelays(glyphs.length, 200, 200);
  
  return (
    <motion.section
      className={combineClasses('enhanced-corridor', containerClass)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className={layerClass}>
        <h1>
          <span className={currentShimmer}>🚪</span> Enhanced Corridor
        </h1>
        <p>A corridor that combines multiple shimmer effects</p>
        
        <div className="corridor-glyphs">
          {glyphs.map((glyph, index) => {
            const { shimmerClass } = useShimmer('reveal', { delay: delays[index] });
            return (
              <span key={index} className={shimmerClass} style={{ margin: '0 1rem' }}>
                {glyph}
              </span>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

// ===== Pattern: Memory Archive with Trail =====
export function MemoryArchive({ memories = [] }) {
  const { containerClass } = useShimmerContainer('shimmer-trail');
  const memoryShimmer = getSemanticShimmer('memory');
  
  return (
    <section className={combineClasses('memory-archive', containerClass)}>
      <h2>Memory Archive</h2>
      <div className="memories">
        {memories.map((memory, index) => {
          const { shimmerClass } = useShimmer(memoryShimmer, {
            delay: index * 100,
          });
          return (
            <div key={memory.id} className={combineClasses('memory-item', shimmerClass)}>
              <span className="memory-icon">🧠</span>
              <span className="memory-text">{memory.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ===== Pattern: Ritual Space =====
export function RitualSpace({ title, children }) {
  const { containerClass, layerClass } = useShimmerContainer(
    containerPresets.ritual.type,
    containerPresets.ritual.options
  );
  
  const ritualShimmer = getSemanticShimmer('ritual');
  const { shimmerClass } = useShimmer(ritualShimmer, { delay: 400 });
  
  return (
    <motion.section
      className={combineClasses('ritual-space', containerClass)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <div className={layerClass}>
        <h1>
          <span className={shimmerClass}>🕯️</span> {title}
        </h1>
        {children}
      </div>
    </motion.section>
  );
}

// ===== Pattern: Witnessed Truth =====
export function WitnessedTruth({ truth, witness }) {
  const { currentShimmer, startSequence } = useShimmerSequence([
    { type: 'reveal', delay: 0 },
    { type: 'breath', delay: 1000 },
  ], true);
  
  const witnessType = getAccessibleShimmerType('trail-layered', '');
  const { shimmerClass: witnessClass } = useShimmer(witnessType);
  
  return (
    <div className="witnessed-truth">
      <blockquote>
        <span className={currentShimmer}>💎</span> {truth}
      </blockquote>
      <footer>
        <span className={witnessClass}>👁️</span> Witnessed by {witness}
        <button onClick={startSequence} style={{ marginLeft: '1rem' }}>
          ⟳ Replay
        </button>
      </footer>
    </div>
  );
}

// ===== Composite Pattern: Full Codex Section =====
export function CodexSection({ type = 'sanctum', title, glyphs = [], content }) {
  const containerConfig = containerPresets[type] || containerPresets.sanctum;
  const { containerClass, layerClass } = useShimmerContainer(
    containerConfig.type,
    containerConfig.options
  );
  
  const titleShimmer = getSemanticShimmer(type);
  const { shimmerClass: titleClass } = useShimmer(titleShimmer, { delay: 200 });
  
  const glyphDelays = generateStaggeredDelays(glyphs.length, 400, 150);
  
  return (
    <motion.section
      className={combineClasses(`codex-${type}`, containerClass)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: 'easeOut' }}
    >
      <div className={layerClass}>
        <h1>
          <span className={titleClass}>{glyphs[0] || '✨'}</span> {title}
        </h1>
        
        {glyphs.length > 1 && (
          <div className="section-glyphs">
            {glyphs.slice(1).map((glyph, index) => {
              const { shimmerClass } = useShimmer('reveal', {
                delay: glyphDelays[index],
              });
              return (
                <span key={index} className={shimmerClass} style={{ margin: '0 0.5rem' }}>
                  {glyph}
                </span>
              );
            })}
          </div>
        )}
        
        <div className="section-content">{content}</div>
      </div>
    </motion.section>
  );
}

export default {
  GlyphWithPreset,
  SanctumWithPreset,
  EntranceAnimation,
  StaggeredGlyphs,
  AccessibleShimmer,
  SemanticShimmers,
  EnhancedCorridor,
  MemoryArchive,
  RitualSpace,
  WitnessedTruth,
  CodexSection,
};
