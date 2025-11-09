// Shimmer Hooks - Reusable hooks for shimmer effects in the Codex

// Element-level shimmer effects
export {
  useShimmer,
  useShimmerTrail,
  useMultipleShimmers,
  useShimmerSequence,
  useHoverShimmer,
} from './useShimmer';

// Container-level shimmer effects
export {
  useShimmerContainer,
  useScrollShimmer,
  useMultipleContainers,
  useShimmerTiming,
} from './useShimmerContainer';

// Utility functions and presets
export {
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
} from './shimmerUtils';

// Shimmer animation types available:
// - 'reveal': One-time reveal with glow (1.2s)
// - 'depth': Depth effect with scale (1.2s)
// - 'breath': Continuous breathing effect (3.5s infinite)
// - 'heartbeat': Heartbeat pulse effect (2.2s infinite)
// - 'memory': Memory trail effect (4s infinite)
// - 'trail-layered': Layered hover trail effect

// Container types available:
// - 'parallax': Parallax scroll container
// - 'breath': Breathing scroll container
// - 'recursive': Recursive scroll container
// - 'breathline': Breathline scroll container
// - 'shimmer-trail': Shimmer trail container

