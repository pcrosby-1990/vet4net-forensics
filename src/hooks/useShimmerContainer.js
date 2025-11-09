import { useState, useEffect, useRef } from 'react';

/**
 * Hook for applying shimmer container effects (parallax, breath, recursive, breathline scrolls)
 * @param {string} containerType - Type of container: 'parallax', 'breath', 'recursive', 'breathline', 'shimmer-trail'
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoApply - Auto-apply on mount (default: true)
 * @returns {Object} { containerClass, layerClass }
 */
export function useShimmerContainer(containerType = 'parallax', options = {}) {
  const { autoApply = true } = options;

  const getContainerClasses = () => {
    if (!autoApply) return { containerClass: '', layerClass: '' };

    const containerMap = {
      'parallax': {
        containerClass: 'parallax-scroll',
        layerClass: 'parallax-layer',
      },
      'breath': {
        containerClass: 'breath-scroll',
        layerClass: 'breath-layer',
      },
      'recursive': {
        containerClass: 'recursive-scroll',
        layerClass: 'recursive-layer',
      },
      'breathline': {
        containerClass: 'breathline-scroll',
        layerClass: 'breathline-layer',
      },
      'shimmer-trail': {
        containerClass: 'shimmer-trail',
        layerClass: '',
      },
    };

    return containerMap[containerType] || { containerClass: '', layerClass: '' };
  };

  const classes = getContainerClasses();

  return classes;
}

/**
 * Hook for managing scroll-based shimmer effects
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection observer threshold (default: 0.1)
 * @param {string} options.shimmerType - Shimmer animation type to apply on scroll
 * @returns {Object} { ref, isVisible, shimmerClass }
 */
export function useScrollShimmer(options = {}) {
  const { threshold = 0.1, shimmerType = 'reveal' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const shimmerClass = isVisible ? `sigil-hover ${shimmerType}` : '';

  return {
    ref,
    isVisible,
    shimmerClass,
  };
}

/**
 * Hook for combining multiple shimmer container effects
 * @param {Array<string>} containerTypes - Array of container types to apply
 * @returns {string} Combined container class names
 */
export function useMultipleContainers(containerTypes = []) {
  const [combinedClasses, setCombinedClasses] = useState('');

  useEffect(() => {
    const classMap = {
      'parallax': 'parallax-scroll',
      'breath': 'breath-scroll',
      'recursive': 'recursive-scroll',
      'breathline': 'breathline-scroll',
      'shimmer-trail': 'shimmer-trail',
    };

    const classes = containerTypes
      .map(type => classMap[type])
      .filter(Boolean)
      .join(' ');

    setCombinedClasses(classes);
  }, [containerTypes.join(',')]);

  return combinedClasses;
}

/**
 * Hook for creating custom shimmer timing configurations
 * @param {Object} config - Timing configuration
 * @param {number} config.duration - Animation duration in seconds
 * @param {string} config.easing - CSS easing function
 * @param {number} config.delay - Animation delay in seconds
 * @returns {Object} CSS-in-JS style object for custom timing
 */
export function useShimmerTiming(config = {}) {
  const {
    duration = 1.2,
    easing = 'ease-out',
    delay = 0,
  } = config;

  const [style, setStyle] = useState({});

  useEffect(() => {
    setStyle({
      animationDuration: `${duration}s`,
      animationTimingFunction: easing,
      animationDelay: `${delay}s`,
    });
  }, [duration, easing, delay]);

  return style;
}

export default useShimmerContainer;
