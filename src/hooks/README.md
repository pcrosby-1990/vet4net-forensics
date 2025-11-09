# Shimmer Hooks Documentation

Reusable React hooks for managing shimmer effects throughout the Codex application.

## Installation

```javascript
import { useShimmer, useShimmerContainer, useScrollShimmer } from './hooks';
```

## Available Hooks

### Element-Level Shimmer Effects

#### `useShimmer(animationType, options)`

Apply shimmer animations to individual elements.

**Parameters:**
- `animationType` (string): Type of shimmer effect
  - `'reveal'`: One-time reveal with glow (1.2s)
  - `'depth'`: Depth effect with scale (1.2s)
  - `'breath'`: Continuous breathing effect (3.5s infinite)
  - `'heartbeat'`: Heartbeat pulse effect (2.2s infinite)
  - `'memory'`: Memory trail effect (4s infinite)
- `options` (object):
  - `autoTrigger` (boolean): Auto-trigger on mount (default: true)
  - `delay` (number): Delay before animation starts in ms (default: 0)

**Returns:**
- `shimmerClass` (string): CSS class to apply
- `triggerShimmer` (function): Manually trigger shimmer
- `isShimmering` (boolean): Current shimmer state

**Example:**
```javascript
function MyComponent() {
  const { shimmerClass } = useShimmer('reveal', { delay: 400 });
  
  return <span className={shimmerClass}>🔮</span>;
}
```

#### `useShimmerTrail(options)`

Apply trail-layered hover effect with pseudo-elements.

**Example:**
```javascript
function MyComponent() {
  const trailClass = useShimmerTrail();
  
  return <span className={trailClass}>✨</span>;
}
```

#### `useShimmerSequence(sequence, autoStart)`

Chain multiple shimmer animations in sequence.

**Parameters:**
- `sequence` (array): Array of `{type, delay}` objects
- `autoStart` (boolean): Auto-start on mount (default: true)

**Returns:**
- `currentShimmer` (string): Current shimmer class
- `currentIndex` (number): Current animation index
- `isPlaying` (boolean): Sequence playing state
- `startSequence` (function): Start the sequence
- `reset` (function): Reset sequence

**Example:**
```javascript
function MyComponent() {
  const { currentShimmer, startSequence } = useShimmerSequence([
    { type: 'reveal', delay: 0 },
    { type: 'breath', delay: 1000 },
    { type: 'heartbeat', delay: 2000 },
  ]);
  
  return (
    <div>
      <span className={currentShimmer}>🌟</span>
      <button onClick={startSequence}>Replay</button>
    </div>
  );
}
```

#### `useHoverShimmer(animationType)`

Trigger shimmer on hover.

**Example:**
```javascript
function MyComponent() {
  const { shimmerClass, handleMouseEnter, handleMouseLeave } = useHoverShimmer('breath');
  
  return (
    <span 
      className={shimmerClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      🔆
    </span>
  );
}
```

#### `useMultipleShimmers(animationTypes)`

Manage multiple shimmer states simultaneously.

**Example:**
```javascript
function MyComponent() {
  const shimmers = useMultipleShimmers(['reveal', 'breath', 'heartbeat']);
  
  return (
    <>
      <span className={shimmers.reveal}>🌙</span>
      <span className={shimmers.breath}>☀️</span>
      <span className={shimmers.heartbeat}>⭐</span>
    </>
  );
}
```

### Container-Level Shimmer Effects

#### `useShimmerContainer(containerType, options)`

Apply shimmer effects to container elements.

**Parameters:**
- `containerType` (string):
  - `'parallax'`: Parallax scroll effect
  - `'breath'`: Breathing background effect
  - `'recursive'`: Recursive scroll effect
  - `'breathline'`: Breathline scroll effect
  - `'shimmer-trail'`: Shimmer trail container

**Returns:**
- `containerClass` (string): Container CSS class
- `layerClass` (string): Layer CSS class (for nested content)

**Example:**
```javascript
function MySection() {
  const { containerClass, layerClass } = useShimmerContainer('breath');
  
  return (
    <section className={containerClass}>
      <div className={layerClass}>
        <h1>Breathing Section</h1>
        <p>Content here...</p>
      </div>
    </section>
  );
}
```

#### `useScrollShimmer(options)`

Trigger shimmer when element scrolls into view.

**Parameters:**
- `options` (object):
  - `threshold` (number): Intersection observer threshold (default: 0.1)
  - `shimmerType` (string): Shimmer type to apply (default: 'reveal')

**Returns:**
- `ref` (ref): Ref to attach to element
- `isVisible` (boolean): Element visibility state
- `shimmerClass` (string): CSS class when visible

**Example:**
```javascript
function MyComponent() {
  const { ref, shimmerClass } = useScrollShimmer({ 
    threshold: 0.3, 
    shimmerType: 'reveal' 
  });
  
  return (
    <div ref={ref} className={shimmerClass}>
      <h2>Appears with shimmer on scroll!</h2>
    </div>
  );
}
```

#### `useShimmerTiming(config)`

Customize shimmer animation timing.

**Parameters:**
- `config` (object):
  - `duration` (number): Duration in seconds (default: 1.2)
  - `easing` (string): CSS easing function (default: 'ease-out')
  - `delay` (number): Delay in seconds (default: 0)

**Returns:**
- `style` (object): CSS-in-JS style object

**Example:**
```javascript
function MyComponent() {
  const { shimmerClass } = useShimmer('reveal');
  const customTiming = useShimmerTiming({ 
    duration: 2.5, 
    easing: 'ease-in-out',
    delay: 0.5 
  });
  
  return (
    <span className={shimmerClass} style={customTiming}>
      ✨ Custom timing
    </span>
  );
}
```

## Integration with Framer Motion

All shimmer hooks work seamlessly with Framer Motion:

```javascript
import { motion } from 'framer-motion';
import { useShimmer, useShimmerContainer } from './hooks';

function MyComponent() {
  const { shimmerClass } = useShimmer('reveal');
  const { containerClass } = useShimmerContainer('breath');
  
  return (
    <motion.section
      className={containerClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1><span className={shimmerClass}>🌟</span> Title</h1>
    </motion.section>
  );
}
```

## Best Practices

1. **Performance**: Use `autoTrigger: false` for components that may re-render frequently
2. **Accessibility**: Shimmer effects are purely visual - ensure content is accessible without them
3. **Timing**: Use appropriate delays to create staggered effects across multiple elements
4. **Cleanup**: Hooks automatically clean up timeouts and observers on unmount

## CSS Requirements

These hooks require the shimmer CSS definitions in `glyphs.css`:
- Keyframes: `shimmerReveal`, `shimmerDepth`, `shimmerBreath`, `heartbeatShimmer`, `shimmerMemoryTrail`
- Classes: `sigil-hover`, `parallax-scroll`, `breath-scroll`, etc.
