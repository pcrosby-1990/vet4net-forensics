# Migration Guide - Shimmer Hooks

## Quick Start

### 1. Import the hooks
```javascript
import { useShimmer, useShimmerContainer, useShimmerTrail } from '../hooks';
```

### 2. Replace hardcoded classes with hooks

## Common Migration Patterns

### Pattern 1: Simple Shimmer Class
**Before:**
```javascript
<span className="sigil-hover reveal">✨</span>
```

**After:**
```javascript
const { shimmerClass } = useShimmer('reveal', { delay: 400 });
<span className={shimmerClass}>✨</span>
```

---

### Pattern 2: Trail-Layered Effect
**Before:**
```javascript
<span className="sigil-hover trail-layered">🧱</span>
```

**After:**
```javascript
const sigilClass = useShimmerTrail();
<span className={sigilClass}>🧱</span>
```

---

### Pattern 3: Container with Shimmer Trail
**Before:**
```javascript
<motion.section
  className="sanctum-of-held-truths shimmer-trail"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
>
  <h1><span className="sigil-hover trail-layered">🧱</span> Title</h1>
</motion.section>
```

**After:**
```javascript
const { containerClass } = useShimmerContainer('shimmer-trail');
const sigilClass = useShimmerTrail();

<motion.section
  className={`sanctum-of-held-truths ${containerClass}`}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
>
  <h1><span className={sigilClass}>🧱</span> Title</h1>
</motion.section>
```

---

### Pattern 4: Breath Scroll Container
**Before:**
```javascript
<section className="corridor breath-scroll">
  <div className="breath-layer">
    <span className="sigil-hover breath">🔁</span>
  </div>
</section>
```

**After:**
```javascript
const { containerClass, layerClass } = useShimmerContainer('breath');
const { shimmerClass } = useShimmer('breath', { autoTrigger: true, delay: 400 });

<section className={`corridor ${containerClass}`}>
  <div className={layerClass}>
    <span className={shimmerClass}>🔁</span>
  </div>
</section>
```

---

### Pattern 5: Multiple Glyphs with Different Effects
**Before:**
```javascript
<span className="sigil-hover reveal">🌙</span>
<span className="sigil-hover breath">⭐</span>
<span className="sigil-hover heartbeat">✨</span>
```

**After:**
```javascript
const shimmers = useMultipleShimmers(['reveal', 'breath', 'heartbeat']);

<span className={shimmers.reveal}>🌙</span>
<span className={shimmers.breath}>⭐</span>
<span className={shimmers.heartbeat}>✨</span>
```

---

### Pattern 6: Parallax Scroll
**Before:**
```javascript
<section className="scroll-depth parallax-scroll">
  <div className="parallax-layer">
    <span className="sigil-hover depth">🔮</span>
  </div>
</section>
```

**After:**
```javascript
const { containerClass, layerClass } = useShimmerContainer('parallax');
const { shimmerClass } = useShimmer('depth', { delay: 400 });

<section className={`scroll-depth ${containerClass}`}>
  <div className={layerClass}>
    <span className={shimmerClass}>🔮</span>
  </div>
</section>
```

---

## Using Presets (Recommended)

Instead of manually configuring options, use presets:

**Before (manual):**
```javascript
const { shimmerClass } = useShimmer('reveal', { autoTrigger: true, delay: 200 });
```

**After (with preset):**
```javascript
import { shimmerPresets } from '../hooks';

const { shimmerClass } = useShimmer(
  shimmerPresets.quickReveal.type,
  shimmerPresets.quickReveal.options
);
```

---

## Step-by-Step Migration Checklist

1. **Identify shimmer usage** in your component:
   - [ ] Check for `className="sigil-hover ..."`
   - [ ] Check for container classes (`shimmer-trail`, `breath-scroll`, etc.)
   - [ ] Note the animation types used

2. **Import hooks** at the top:
   ```javascript
   import { useShimmer, useShimmerContainer } from '../hooks';
   ```

3. **Add hook calls** in component body:
   ```javascript
   const { shimmerClass } = useShimmer('reveal', { delay: 400 });
   const { containerClass, layerClass } = useShimmerContainer('breath');
   ```

4. **Replace classes** in JSX:
   - Replace `className="sigil-hover reveal"` with `className={shimmerClass}`
   - Replace `className="breath-scroll"` with `className={containerClass}`

5. **Test the component** to ensure shimmer works correctly

6. **Refine timing** if needed using options

---

## Common Pitfalls

### ❌ Don't forget the delay
```javascript
// If animation was using CSS animation-delay
.sigil-hover.reveal {
  animation-delay: 0.4s;
}

// Match it in the hook
const { shimmerClass } = useShimmer('reveal', { delay: 400 });
```

### ❌ Don't mix old and new patterns
```javascript
// Bad - mixing hooks with hardcoded classes
const { shimmerClass } = useShimmer('reveal');
<span className="sigil-hover trail-layered">...</span> // Use hook instead!
```

### ❌ Don't forget to spread the layer class
```javascript
// Bad
<div>{content}</div>

// Good
const { containerClass, layerClass } = useShimmerContainer('breath');
<section className={containerClass}>
  <div className={layerClass}>{content}</div>
</section>
```

---

## Benefits of Migration

✅ **Type safety** - Catch errors at development time  
✅ **Autocomplete** - IDE suggestions for animation types  
✅ **Reusability** - Share shimmer logic across components  
✅ **Maintainability** - Update timing in one place  
✅ **Documentation** - Inline JSDoc comments  
✅ **Advanced features** - Scroll triggers, sequences, hover effects  

---

## Need Help?

- Check `src/hooks/README.md` for full documentation
- See `src/hooks/QUICK_REFERENCE.md` for quick patterns
- Look at `src/hooks/examples.jsx` for before/after examples
- Review `src/hooks/advancedExamples.jsx` for complex patterns
- Test with `src/hooks/ShimmerHooksTest.jsx`

---

## Gradual Migration

You don't need to migrate everything at once! The hooks generate the same CSS classes, so:

- ✅ Old components work as-is
- ✅ New components can use hooks
- ✅ Mix and match during transition
- ✅ No breaking changes

Migrate components incrementally as you work on them.
