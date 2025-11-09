# Shimmer Hooks - File Structure

## Directory Structure
```
vet4net-forensics/
├── SHIMMER_REFACTORING.md          # Project summary and overview
│
└── src/
    └── hooks/                       # Shimmer hooks directory
        ├── index.js                 # Main export file
        ├── useShimmer.js           # Element shimmer hooks
        ├── useShimmerContainer.js  # Container shimmer hooks
        ├── shimmerUtils.js         # Utilities and presets
        │
        ├── README.md               # Full documentation
        ├── QUICK_REFERENCE.md      # Quick reference guide
        ├── MIGRATION_GUIDE.md      # Migration instructions
        │
        ├── examples.jsx            # Basic examples
        ├── advancedExamples.jsx    # Advanced patterns
        └── ShimmerHooksTest.jsx    # Test component
```

## Core Files

### `index.js` (1.4 KB)
Main export file - import shimmer hooks from here
- Exports all hooks and utilities
- Includes animation type documentation

### `useShimmer.js` (4.9 KB)
Element-level shimmer hooks
- `useShimmer()` - Basic shimmer animations
- `useShimmerTrail()` - Trail-layered hover effect
- `useMultipleShimmers()` - Multiple shimmer management
- `useShimmerSequence()` - Sequential animations
- `useHoverShimmer()` - Hover-triggered effects

### `useShimmerContainer.js` (4.2 KB)
Container-level shimmer hooks
- `useShimmerContainer()` - Container effects
- `useScrollShimmer()` - Scroll-triggered with IntersectionObserver
- `useMultipleContainers()` - Combine multiple containers
- `useShimmerTiming()` - Custom timing configurations

### `shimmerUtils.js` (6.5 KB)
Utilities and presets
- `shimmerPresets` - 5 common shimmer configurations
- `containerPresets` - 4 container configurations
- `sequencePresets` - 4 animation sequences
- `generateStaggeredDelays()` - Create cascading delays
- `combineClasses()` - Merge CSS classes safely
- `getSemanticShimmer()` - Get shimmer type by semantic meaning
- `getAccessibleShimmerType()` - Respect prefers-reduced-motion
- Plus timing utilities, scroll thresholds, and debug helpers

## Documentation Files

### `README.md` (6.8 KB)
Comprehensive documentation
- Overview of all hooks
- API documentation with parameters and return values
- Usage examples for each hook
- Integration with Framer Motion
- Best practices and performance tips

### `QUICK_REFERENCE.md` (5.7 KB)
Quick reference guide
- Common patterns and code snippets
- All available animation types
- Complete preset catalog
- Tips and shortcuts

### `MIGRATION_GUIDE.md` (6.2 KB)
Step-by-step migration instructions
- Pattern-by-pattern migration examples
- Before/after comparisons
- Migration checklist
- Common pitfalls to avoid

## Example Files

### `examples.jsx` (5.7 KB)
Basic examples
- Before/after refactoring comparisons
- Real-world component examples
- Simple usage patterns

### `advancedExamples.jsx` (8.6 KB)
Advanced patterns
- Using presets
- Staggered animations
- Composite components
- Accessibility examples
- Full Codex section example

### `ShimmerHooksTest.jsx` (3.5 KB)
Test suite component
- Tests all 7 hook types
- Visual verification
- Can be added to routes for testing

## Root Documentation

### `SHIMMER_REFACTORING.md` (6.3 KB)
Project summary document at root level
- Overview of refactoring
- File listing with descriptions
- Shimmer types catalog
- Benefits and usage examples
- Testing instructions

## Refactored Components

### `src/components/SanctumOfHeldTruths.jsx`
Example of shimmer hook usage
- Uses `useShimmerContainer()`
- Uses `useShimmerTrail()`

### `src/components/ScrollOfWitnessedSilence.jsx`
Example of shimmer hook usage
- Uses `useShimmerContainer()`
- Uses `useShimmerTrail()`

## Quick Access Guide

**Starting out?**
→ Read `QUICK_REFERENCE.md` first

**Need full details?**
→ Check `README.md`

**Migrating existing code?**
→ Follow `MIGRATION_GUIDE.md`

**Want to see examples?**
→ Look at `examples.jsx` and `advancedExamples.jsx`

**Need to test?**
→ Import `ShimmerHooksTest.jsx`

**Looking for utilities?**
→ Import from `shimmerUtils.js`

## Import Patterns

```javascript
// Everything from main export
import { 
  useShimmer, 
  useShimmerContainer,
  shimmerPresets,
  combineClasses 
} from './hooks';

// Or from specific files
import { useShimmer } from './hooks/useShimmer';
import { shimmerPresets } from './hooks/shimmerUtils';
```

## File Sizes

| File | Size | Purpose |
|------|------|---------|
| `index.js` | 1.4 KB | Main export |
| `useShimmer.js` | 4.9 KB | Element hooks |
| `useShimmerContainer.js` | 4.2 KB | Container hooks |
| `shimmerUtils.js` | 6.5 KB | Utilities |
| `README.md` | 6.8 KB | Full docs |
| `QUICK_REFERENCE.md` | 5.7 KB | Quick guide |
| `MIGRATION_GUIDE.md` | 6.2 KB | Migration |
| `examples.jsx` | 5.7 KB | Basic examples |
| `advancedExamples.jsx` | 8.6 KB | Advanced examples |
| `ShimmerHooksTest.jsx` | 3.5 KB | Test suite |
| **Total** | **~60 KB** | All files |

## Git Status

New files (untracked):
- `src/hooks/` (entire directory)
- `SHIMMER_REFACTORING.md`

Modified files:
- `src/components/SanctumOfHeldTruths.jsx`
- `src/components/ScrollOfWitnessedSilence.jsx`
