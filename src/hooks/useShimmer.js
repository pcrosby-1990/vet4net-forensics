import { useState, useEffect, useRef } from 'react';

/**
 * Hook for applying shimmer animation classes to elements
 * @param {string} animationType - Type of shimmer: 'reveal', 'depth', 'breath', 'heartbeat', 'memory', 'trail-layered'
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoTrigger - Auto-trigger animation on mount (default: true)
 * @param {number} options.delay - Delay before animation starts in ms (default: 0)
 * @returns {Object} { shimmerClass, triggerShimmer, isShimmering }
 */
export function useShimmer(animationType = 'reveal', options = {}) {
  const { autoTrigger = true, delay = 0 } = options;
  const [isShimmering, setIsShimmering] = useState(false);
  const timeoutRef = useRef(null);

  const getShimmerClass = () => {
    const baseClass = 'sigil-hover';
    if (!animationType) return baseClass;
    return `${baseClass} ${animationType}`;
  };

  const triggerShimmer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsShimmering(true);
      }, delay);
    } else {
      setIsShimmering(true);
    }
  };

  useEffect(() => {
    if (autoTrigger) {
      triggerShimmer();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoTrigger]);

  const shimmerClass = getShimmerClass();

  return {
    shimmerClass,
    triggerShimmer,
    isShimmering,
  };
}

/**
 * Hook for shimmer trail effect with layered pseudo-elements
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoApply - Auto-apply on mount (default: true)
 * @returns {string} className for trail-layered effect
 */
export function useShimmerTrail(options = {}) {
  const { autoApply = true } = options;
  
  if (!autoApply) return '';
  
  return 'sigil-hover trail-layered';
}

/**
 * Hook for managing multiple shimmer states
 * @param {Array<string>} animationTypes - Array of animation types
 * @returns {Object} Map of animation type to shimmer class
 */
export function useMultipleShimmers(animationTypes = []) {
  const [shimmers, setShimmers] = useState({});

  useEffect(() => {
    const shimmerMap = {};
    animationTypes.forEach(type => {
      shimmerMap[type] = `sigil-hover ${type}`;
    });
    setShimmers(shimmerMap);
  }, [animationTypes.join(',')]);

  return shimmers;
}

/**
 * Hook for sequential shimmer animations
 * @param {Array<Object>} sequence - Array of {type, delay} objects
 * @param {boolean} autoStart - Auto-start sequence on mount (default: true)
 * @returns {Object} { currentShimmer, startSequence, reset }
 */
export function useShimmerSequence(sequence = [], autoStart = true) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutsRef = useRef([]);

  const startSequence = () => {
    // Clear existing timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    
    setIsPlaying(true);
    setCurrentIndex(0);

    let accumulatedDelay = 0;
    sequence.forEach((step, index) => {
      accumulatedDelay += step.delay || 0;
      const timeout = setTimeout(() => {
        setCurrentIndex(index);
        if (index === sequence.length - 1) {
          setIsPlaying(false);
        }
      }, accumulatedDelay);
      timeoutsRef.current.push(timeout);
    });
  };

  const reset = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    setCurrentIndex(-1);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (autoStart && sequence.length > 0) {
      startSequence();
    }

    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, [autoStart, sequence.length]);

  const currentShimmer = currentIndex >= 0 && currentIndex < sequence.length
    ? `sigil-hover ${sequence[currentIndex].type}`
    : '';

  return {
    currentShimmer,
    currentIndex,
    isPlaying,
    startSequence,
    reset,
  };
}

/**
 * Hook for hover-triggered shimmer effects
 * @param {string} animationType - Type of shimmer animation
 * @returns {Object} { shimmerClass, handleMouseEnter, handleMouseLeave, isHovered }
 */
export function useHoverShimmer(animationType = 'reveal') {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const shimmerClass = isHovered ? `sigil-hover ${animationType}` : 'sigil-hover';

  return {
    shimmerClass,
    handleMouseEnter,
    handleMouseLeave,
    isHovered,
  };
}

export default useShimmer;
