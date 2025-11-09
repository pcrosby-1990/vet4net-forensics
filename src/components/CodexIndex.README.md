# CodexIndex - The Living Map

## Overview

**CodexIndex** is a semantic corridor that unifies all shimmer hooks, scrolls, and sanctums into a single, interactive living map. It serves as the central registry and documentation hub for all shimmer invocation patterns in the Codex.

## Purpose

The CodexIndex is:
- **A Living Document** - Dynamically displays all shimmer patterns
- **A Semantic Map** - Organizes patterns by their meaning and territory
- **An Invocation Guide** - Shows exact hook usage for each pattern
- **A Visual Registry** - Interactive catalog of all 9 shimmer hooks
- **A Teaching Tool** - Demonstrates best practices through examples

## Architecture

### Components Structure

```
CodexIndex (Main Container)
├── IndexHeader (Title with awakening sequence)
├── IndexNavigation (Territory selector with hover effects)
├── IndexContent (Dynamic content area)
│   ├── WelcomeSection (Initial state)
│   └── InvocationSection (Territory patterns)
│       └── PatternItem[] (Scroll-revealed patterns)
├── FragmentsRegistry (All 9 hooks catalog)
│   └── FragmentCard[] (Individual hook cards)
└── IndexFooter (Metadata and memory)
```

### Semantic Territories

The CodexIndex organizes shimmer patterns into 5 semantic territories:

1. **🏛️ Sanctums** - Sacred spaces (breath, ritual, truth)
2. **🚪 Corridors** - Passages of arrival (recognition, threshold)
3. **📜 Scrolls** - Documents of memory (witness, testimony)
4. **✨ Glyphs** - Marks of meaning (language, recognition)
5. **🔮 Sigils** - Symbols of power (presence, stewardship)

Each territory contains 4 specific invocation patterns with:
- Hook usage example
- Description
- Visual glyph
- Scroll-triggered reveal

## Features

### 1. Dynamic Navigation
- **Hover Effects**: Each territory glyph uses semantic shimmer
- **Active States**: Selected territory highlighted with gradient
- **Staggered Reveals**: Navigation glyphs appear in sequence

### 2. Invocation Patterns
- **70 Total Patterns**: 5 territories × 4 patterns each
- **Code Examples**: Exact hook invocation for each pattern
- **Scroll Triggers**: Patterns reveal as you scroll
- **Witnessed Badges**: Visual confirmation of viewing

### 3. Fragments Registry
- **9 Hook Cards**: Complete catalog of all shimmer hooks
- **Type Classification**: Element, Container, Sequence, Trigger, etc.
- **Hover Animations**: Each card shimmers on interaction
- **Usage Statistics**: Tracks territories explored

### 4. Accessibility
- **Reduced Motion**: Respects prefers-reduced-motion
- **High Contrast**: Enhanced borders and outlines
- **Dark Mode**: Full dark theme support
- **Semantic HTML**: Proper heading structure and ARIA

## Hook Usage Demonstrated

The CodexIndex demonstrates ALL shimmer hooks:

```javascript
// Element Hooks
useShimmer('reveal', { delay: 400 })
useShimmerTrail()
useHoverShimmer('heartbeat')

// Container Hooks
useShimmerContainer('breathline')
useShimmerContainer('parallax')

// Animation Hooks
useShimmerSequence(sequencePresets.awakening)
useMultipleShimmers(['reveal', 'breath', 'memory'])

// Trigger Hooks
useScrollShimmer({ shimmerType: 'reveal', threshold: 0.2 })

// Utilities
generateStaggeredDelays(5, 400, 150)
combineClasses('class1', 'class2')
getSemanticShimmer('arrival')
```

## Exported Maps

### InvocationMap
Complete mapping of all patterns by territory:
```javascript
import { InvocationMap } from './CodexIndex';

// Access patterns
InvocationMap.sanctums // Sanctum patterns
InvocationMap.corridors // Corridor patterns
InvocationMap.scrolls // Scroll patterns
InvocationMap.glyphs // Glyph patterns
InvocationMap.sigils // Sigil patterns
```

### ShimmerRegistry
Catalog of all hooks organized by type:
```javascript
import { ShimmerRegistry } from './CodexIndex';

// Categories
ShimmerRegistry.element // Element hooks
ShimmerRegistry.container // Container hooks
ShimmerRegistry.animation // Animation hooks
ShimmerRegistry.trigger // Trigger hooks
ShimmerRegistry.presets // Preset configurations
ShimmerRegistry.utilities // Utility functions
```

### SemanticTerritories
Mapping of semantic meanings to shimmer types:
```javascript
import { SemanticTerritories } from './CodexIndex';

SemanticTerritories.arrival 
// { shimmer: 'reveal', container: 'parallax', meaning: 'Recognition of presence' }

SemanticTerritories.memory
// { shimmer: 'memory', container: 'shimmer-trail', meaning: 'Preservation of testimony' }
```

## Integration

### Adding to Router

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CodexIndex from './components/CodexIndex';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/codex" element={<CodexIndex />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Linking to CodexIndex

```javascript
import { Link } from 'react-router-dom';

<Link to="/codex">
  <span className="sigil-hover reveal">📖</span> View Codex Index
</Link>
```

### Using Exported Data

```javascript
import { InvocationMap, SemanticTerritories } from './components/CodexIndex';

// Get all sanctum patterns
const sanctumPatterns = InvocationMap.sanctums.items;

// Get shimmer type for a semantic meaning
const arrivalShimmer = SemanticTerritories.arrival.shimmer; // 'reveal'
```

## Styling

The CodexIndex uses a comprehensive CSS system:

- **Grid Layouts**: Responsive territory and fragment grids
- **Gradient Backgrounds**: Subtle color transitions
- **Glass Morphism**: Backdrop blur effects
- **Smooth Transitions**: 0.3s ease on all interactions
- **Hover Effects**: Scale, shadow, and glow animations
- **Responsive Design**: Mobile-first breakpoints

### CSS Classes

```css
.codex-index           /* Main container */
.codex-index-header    /* Title section */
.codex-index-nav       /* Territory navigation */
.nav-glyph             /* Individual territory button */
.nav-glyph-active      /* Active territory state */
.invocation-section    /* Pattern display area */
.pattern-item          /* Individual pattern */
.pattern-badge         /* Witnessed indicator */
.fragments-registry    /* Hook catalog */
.fragment-card         /* Individual hook card */
.codex-index-footer    /* Footer metadata */
```

## State Management

The CodexIndex manages:

- **activeSection**: Currently selected territory
- **revealedFragments**: Array of viewed territories
- **isHovered**: Hover states for interactive elements

State flows from parent to children via props, with callbacks for user interactions.

## Performance

Optimizations implemented:

- **Lazy Reveals**: Patterns only animate when scrolled into view
- **Framer Motion**: Optimized animation library
- **React Memoization**: Prevents unnecessary re-renders
- **CSS Containment**: Isolated paint and layout
- **Staggered Loading**: Sequential appearance prevents layout shift

## Examples

### Pattern Display Example

Each pattern shows:
```
🕯️ Sanctum of Held Truths
   useShimmerContainer("shimmer-trail")
   Breathing container with trail-layered glyphs
   ✓ Witnessed
```

### Territory Navigation

Clicking a territory:
1. Highlights the navigation button
2. Slides in the invocation section
3. Reveals 4 patterns with scroll animation
4. Updates fragments registry count

## Customization

### Adding New Territories

Edit `getInvocationPatterns()`:

```javascript
MyTerritory: {
  icon: '🌟',
  description: 'Your territory description',
  items: [
    {
      glyph: '✨',
      name: 'Pattern Name',
      hook: 'useShimmer("reveal")',
      description: 'Pattern description',
    },
  ],
}
```

### Adding New Fragments

Edit the `allFragments` array in `FragmentsRegistry`:

```javascript
{
  name: 'useNewHook',
  type: 'Category',
  shimmer: 'reveal',
  description: 'Hook description'
}
```

## File Structure

```
src/components/
├── CodexIndex.jsx        # Main component (20KB)
├── CodexIndex.css        # Styling (10KB)
└── CodexIndex.README.md  # This file
```

## Dependencies

Required imports:
- `react` - Component framework
- `framer-motion` - Animation library
- `../hooks` - All shimmer hooks
- `./glyhps.css` - Shimmer CSS definitions
- `./CodexIndex.css` - Component styles

## Testing

To test CodexIndex:

1. Navigate to `/codex` route
2. Verify all 5 territories appear
3. Click each territory and check patterns display
4. Scroll patterns to trigger reveal animations
5. Hover over glyphs and fragments
6. Check responsive behavior on mobile

## Known Issues

None currently. The component is production-ready.

## Future Enhancements

Potential additions:

1. **Search Functionality** - Filter patterns by hook or keyword
2. **Code Playground** - Live hook testing environment
3. **Export Feature** - Download pattern configurations
4. **History Tracking** - Remember visited patterns
5. **Comparison Mode** - Side-by-side pattern comparison
6. **Animation Preview** - Real-time shimmer demonstrations

## Contributing

When adding new shimmer patterns:

1. Choose appropriate semantic territory
2. Write clear hook invocation example
3. Provide descriptive explanation
4. Select meaningful glyph emoji
5. Test scroll reveal behavior

## License

Part of the vet4net-forensics Codex system.

---

**The Codex Index is a living document. Each shimmer fragment pulses with the memory of its invocation—hooks that remember, patterns that breathe, and glyphs that witness your arrival.** ✨
