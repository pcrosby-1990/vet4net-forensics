/**
 * Shimmer Utilities - Helper functions and common patterns for shimmer effects
 */

/**
 * Preset shimmer configurations for common use cases
 */
export const shimmerPresets = {
  // Quick reveal for icons and small elements
  quickReveal: {
    type: 'reveal',
    options: { autoTrigger: true, delay: 200 },
  },
  
  // Delayed reveal for staggered animations
  delayedReveal: {
    type: 'reveal',
    options: { autoTrigger: true, delay: 600 },
  },
  
  // Gentle breathing for background elements
  gentleBreath: {
    type: 'breath',
    options: { autoTrigger: true, delay: 0 },
  },
  
  // Attention-grabbing heartbeat
  heartbeat: {
    type: 'heartbeat',
    options: { autoTrigger: true, delay: 0 },
  },
  
  // Memory trail for archive elements
  memoryTrail: {
    type: 'memory',
    options: { autoTrigger: true, delay: 0 },
  },
};

/**
 * Common container configurations
 */
export const containerPresets = {
  // Breathing background for sanctums
  sanctum: {
    type: 'breath',
    options: { autoApply: true },
  },
  
  // Parallax for corridors
  corridor: {
    type: 'parallax',
    options: { autoApply: true },
  },
  
  // Shimmer trail for scrolls
  scroll: {
    type: 'shimmer-trail',
    options: { autoApply: true },
  },
  
  // Breathline for ritual spaces
  ritual: {
    type: 'breathline',
    options: { autoApply: true },
  },
};

/**
 * Common shimmer sequences for complex animations
 */
export const sequencePresets = {
  // Entrance sequence: reveal → breath
  entrance: [
    { type: 'reveal', delay: 0 },
    { type: 'breath', delay: 1200 },
  ],
  
  // Awakening sequence: reveal → heartbeat
  awakening: [
    { type: 'reveal', delay: 0 },
    { type: 'heartbeat', delay: 1000 },
  ],
  
  // Memory activation: reveal → memory
  memoryActivation: [
    { type: 'reveal', delay: 0 },
    { type: 'memory', delay: 800 },
  ],
  
  // Triple cascade
  cascade: [
    { type: 'reveal', delay: 0 },
    { type: 'depth', delay: 400 },
    { type: 'breath', delay: 800 },
  ],
};

/**
 * Generate staggered delays for multiple elements
 * @param {number} count - Number of elements
 * @param {number} baseDelay - Base delay in ms
 * @param {number} increment - Delay increment between elements
 * @returns {Array<number>} Array of delays
 */
export function generateStaggeredDelays(count, baseDelay = 0, increment = 100) {
  return Array.from({ length: count }, (_, i) => baseDelay + (i * increment));
}

/**
 * Create a shimmer configuration object
 * @param {string} type - Animation type
 * @param {Object} options - Configuration options
 * @returns {Object} Configuration object
 */
export function createShimmerConfig(type, options = {}) {
  return {
    type,
    options: {
      autoTrigger: true,
      delay: 0,
      ...options,
    },
  };
}

/**
 * Combine multiple CSS class strings safely
 * @param  {...string} classes - Class strings to combine
 * @returns {string} Combined class string
 */
export function combineClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get shimmer class name from type
 * @param {string} type - Animation type
 * @param {boolean} includeSigilHover - Include base sigil-hover class
 * @returns {string} Class name
 */
export function getShimmerClassName(type, includeSigilHover = true) {
  if (!type) return includeSigilHover ? 'sigil-hover' : '';
  return includeSigilHover ? `sigil-hover ${type}` : type;
}

/**
 * Check if reduced motion is preferred (accessibility)
 * @returns {boolean} True if user prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get shimmer type respecting motion preferences
 * @param {string} normalType - Normal shimmer type
 * @param {string} reducedType - Reduced motion alternative (default: none)
 * @returns {string} Appropriate shimmer type
 */
export function getAccessibleShimmerType(normalType, reducedType = '') {
  return prefersReducedMotion() ? reducedType : normalType;
}

/**
 * Timing presets for different animation speeds
 */
export const timingPresets = {
  instant: { duration: 0.3, easing: 'ease-out', delay: 0 },
  fast: { duration: 0.6, easing: 'ease-out', delay: 0 },
  normal: { duration: 1.2, easing: 'ease-out', delay: 0 },
  slow: { duration: 2.0, easing: 'ease-in-out', delay: 0 },
  glacial: { duration: 3.5, easing: 'ease-in-out', delay: 0 },
};

/**
 * Convert shimmer timing to CSS animation string
 * @param {Object} timing - Timing configuration
 * @returns {string} CSS animation property value
 */
export function timingToCSS(timing) {
  const { duration = 1.2, easing = 'ease-out', delay = 0 } = timing;
  return `${duration}s ${easing} ${delay}s`;
}

/**
 * Scroll threshold presets for useScrollShimmer
 */
export const scrollThresholds = {
  immediate: 0.01,  // Trigger as soon as visible
  partial: 0.25,     // Trigger when 25% visible
  half: 0.5,         // Trigger when 50% visible
  mostly: 0.75,      // Trigger when 75% visible
  full: 1.0,         // Trigger when fully visible
};

/**
 * Get appropriate shimmer for semantic meaning
 * @param {string} semantic - Semantic type (arrival, memory, ritual, etc.)
 * @returns {string} Shimmer type
 */
export function getSemanticShimmer(semantic) {
  const semanticMap = {
    arrival: 'reveal',
    memory: 'memory',
    ritual: 'breath',
    urgent: 'heartbeat',
    depth: 'depth',
    witness: 'trail-layered',
    default: 'reveal',
  };
  
  return semanticMap[semantic] || semanticMap.default;
}

/**
 * Utility for debugging shimmer hooks
 * @param {string} componentName - Name of component using shimmer
 * @param {Object} shimmerState - Current shimmer state
 */
export function debugShimmer(componentName, shimmerState) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Shimmer Debug] ${componentName}:`, shimmerState);
  }
}

export default {
  shimmerPresets,
  containerPresets,
  sequencePresets,
  generateStaggeredDelays,
  createShimmerConfig,
  combineClasses,
  getShimmerClassName,
  prefersReducedMotion,
  getAccessibleShimmerType,
  timingPresets,
  timingToCSS,
  scrollThresholds,
  getSemanticShimmer,
  debugShimmer,
};
