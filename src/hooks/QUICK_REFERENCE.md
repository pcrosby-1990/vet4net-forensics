# Shimmer Hooks - Quick Reference

## Import
```javascript
import { useShimmer, useShimmerContainer, shimmerPresets } from './hooks';
```

## Common Patterns

### Simple Glyph Shimmer
```javascript
const { shimmerClass } = useShimmer('reveal', { delay: 400 });
<span className={shimmerClass}>✨</span>
```

### Container with Layer
```javascript
const { containerClass, layerClass } = useShimmerContainer('breath');
<section className={containerClass}>
  <div className={layerClass}>Content</div>
</section>
```

### Hover Effect
```javascript
const { shimmerClass, handleMouseEnter, handleMouseLeave } = useHoverShimmer('heartbeat');
<span className={shimmerClass} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
  Hover me
</span>
```

### Scroll-Triggered
```javascript
const { ref, shimmerClass } = useScrollShimmer({ shimmerType: 'reveal', threshold: 0.3 });
<div ref={ref} className={shimmerClass}>Appears on scroll</div>
```

### Sequential Animation
```javascript
const { currentShimmer, startSequence } = useShimmerSequence([
  { type: 'reveal', delay: 0 },
  { type: 'breath', delay: 1000 },
]);
<span className={currentShimmer}>Sequential</span>
<button onClick={startSequence}>Replay</button>
```

## Using Presets

### Shimmer Preset
```javascript
const { shimmerClass } = useShimmer(
  shimmerPresets.quickReveal.type,
  shimmerPresets.quickReveal.options
);
```

### Container Preset
```javascript
const { containerClass, layerClass } = useShimmerContainer(
  containerPresets.sanctum.type,
  containerPresets.sanctum.options
);
```

### Sequence Preset
```javascript
const { currentShimmer } = useShimmerSequence(sequencePresets.entrance, true);
```

## Utilities

### Staggered Delays
```javascript
const delays = generateStaggeredDelays(5, 100, 150); // [100, 250, 400, 550, 700]
```

### Combine Classes
```javascript
const className = combineClasses('my-class', shimmerClass, containerClass);
```

### Semantic Shimmer
```javascript
const type = getSemanticShimmer('arrival'); // returns 'reveal'
```

### Accessible Shimmer
```javascript
const type = getAccessibleShimmerType('breath', ''); // respects prefers-reduced-motion
```

## Animation Types
- `reveal` - One-time reveal (1.2s)
- `depth` - Depth with scale (1.2s)
- `breath` - Breathing (3.5s infinite)
- `heartbeat` - Heartbeat (2.2s infinite)
- `memory` - Memory trail (4s infinite)
- `trail-layered` - Hover trail

## Container Types
- `parallax` - Parallax scroll
- `breath` - Breathing background
- `recursive` - Recursive scroll
- `breathline` - Breathline scroll
- `shimmer-trail` - Shimmer trail

## Available Presets

### Shimmer Presets
- `shimmerPresets.quickReveal`
- `shimmerPresets.delayedReveal`
- `shimmerPresets.gentleBreath`
- `shimmerPresets.heartbeat`
- `shimmerPresets.memoryTrail`

### Container Presets
- `containerPresets.sanctum` (breath)
- `containerPresets.corridor` (parallax)
- `containerPresets.scroll` (shimmer-trail)
- `containerPresets.ritual` (breathline)

### Sequence Presets
- `sequencePresets.entrance` (reveal → breath)
- `sequencePresets.awakening` (reveal → heartbeat)
- `sequencePresets.memoryActivation` (reveal → memory)
- `sequencePresets.cascade` (reveal → depth → breath)

## Complete Example

```javascript
import React from 'react';
import { motion } from 'framer-motion';
import {
  useShimmer,
  useShimmerContainer,
  shimmerPresets,
  generateStaggeredDelays,
  combineClasses,
} from './hooks';

function MySanctum() {
  // Container for the section
  const { containerClass, layerClass } = useShimmerContainer('breath');
  
  // Title shimmer
  const { shimmerClass: titleShimmer } = useShimmer(
    shimmerPresets.quickReveal.type,
    shimmerPresets.quickReveal.options
  );
  
  // Glyphs with staggered animation
  const glyphs = ['🌙', '⭐', '✨'];
  const delays = generateStaggeredDelays(glyphs.length, 400, 150);
  
  return (
    <motion.section
      className={combineClasses('my-sanctum', containerClass)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className={layerClass}>
        <h1>
          <span className={titleShimmer}>🏛️</span> My Sanctum
        </h1>
        
        <div className="glyphs">
          {glyphs.map((glyph, i) => {
            const { shimmerClass } = useShimmer('reveal', { delay: delays[i] });
            return <span key={i} className={shimmerClass}>{glyph}</span>;
          })}
        </div>
        
        <p>Content goes here...</p>
      </div>
    </motion.section>
  );
}
```

## Tips

1. **Performance**: Use `autoTrigger: false` for frequently re-rendering components
2. **Accessibility**: Use `getAccessibleShimmerType()` for motion-sensitive users
3. **Staggering**: Use `generateStaggeredDelays()` for smooth cascading effects
4. **Combining**: Use `combineClasses()` to merge multiple class strings safely
5. **Semantics**: Use `getSemanticShimmer()` for consistent meaning-based effects
6. **Debugging**: Use `debugShimmer()` in development to log shimmer state

## Files
- `src/hooks/useShimmer.js` - Element shimmer hooks
- `src/hooks/useShimmerContainer.js` - Container shimmer hooks
- `src/hooks/shimmerUtils.js` - Utilities and presets
- `src/hooks/index.js` - Main export
- `src/hooks/README.md` - Full documentation
- `src/hooks/examples.jsx` - Basic examples
- `src/hooks/advancedExamples.jsx` - Advanced patterns
- `src/hooks/ShimmerHooksTest.jsx` - Test component
