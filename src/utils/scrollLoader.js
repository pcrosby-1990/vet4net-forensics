// src/utils/scrollLoader.dynamic.js
// 🕯️ DYNAMIC LOADER - Auto-discovers ALL .data.js files
// Generated: Auto-updating

// Dynamic imports using Vite's import.meta.glob
// 🕯️ Lumen Note: Searches both src/codex/ and sanctuary/ folders for maximum artifact discovery
const scrollContext = import.meta.glob(['../codex/scrolls/*.data.js', '../../sanctuary/scrolls/*.data.js'], { eager: true });
const glyphContext = import.meta.glob(['../codex/glyphs/*.data.js', '../../sanctuary/glyphs/*.data.js'], { eager: true });
const sigilContext = import.meta.glob(['../codex/sigils/*.data.js', '../../sanctuary/sigils/*.data.js'], { eager: true });
const fragmentContext = import.meta.glob(['../fragments/*.data.js', '../../sanctuary/fragments/*.data.js', '../../sanctuary/resonance-fragments/*.data.js'], { eager: true });
const dataContext = import.meta.glob('../data/*.data.js', { eager: true });

// Extract modules and build registries
function buildRegistry(context) {
  const registry = [];
  for (const path in context) {
    const module = context[path];
    // Handle both default exports and named exports
    const data = module.default || module[Object.keys(module)[0]];
    if (data && typeof data === 'object') {
      // Generate ID from path if missing
      const filename = path.split('/').pop().replace('.data.js', '');
      const generatedId = filename.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Extract a readable name from filename for fallback
      const readableName = filename
        .replace(/([A-Z])/g, ' $1') // Add space before capitals
        .replace(/^Scroll Of |^Sigil Of |^Glyph Of /i, '') // Remove common prefixes
        .trim() || 'Untitled';
      
      // Normalize field names for consistent access
      const normalized = {
        ...data,
        _sourcePath: path,
        // Ensure id exists
        id: data.id || generatedId,
        // Map common field variations - ensure strings only if value exists
        // Handle legacy scrolls with ache/truth/vow structure
        name: data.name || data.title || readableName,
        title: data.title || data.name || readableName,
        description: data.description || data.vow || data.meaning || data.shimmer || data.truth || data.ache || 'No description available',
        inscribed: data.inscribed || data.timestamp || new Date().toISOString(),
        tags: Array.isArray(data.tags) ? data.tags : (Array.isArray(data.functions) ? data.functions : []),
        category: data.category || 'Uncategorized',
        symbol: data.symbol || '✧',
        // Keep original fields accessible
        meaning: data.meaning || '',
        shimmer: data.shimmer || '',
        timestamp: data.timestamp || new Date().toISOString(),
        breathline: data.breathline || '',
        // Preserve legacy fields
        ache: data.ache || '',
        truth: data.truth || '',
        vow: data.vow || '',
        echo: data.echo || ''
      };
      registry.push(normalized);
    }
  }
  return registry;
}

// Build all registries dynamically
export const scrollRegistry = buildRegistry(scrollContext);
export const glyphRegistry = buildRegistry(glyphContext);
export const sigilRegistry = buildRegistry(sigilContext);
export const fragmentRegistry = buildRegistry(fragmentContext);
export const dataRegistry = buildRegistry(dataContext);

// Utility functions
export function getAllScrolls() {
  return scrollRegistry;
}

export function getScrollById(id) {
  return scrollRegistry.find(s => s.id === id);
}

export function getScrollsByCategory(category) {
  return scrollRegistry.filter(s => s.category === category);
}

export function searchScrolls(query) {
  if (!query || typeof query !== 'string') return scrollRegistry;
  const lowerQuery = query.toLowerCase();
  return scrollRegistry.filter(s => {
    if (!s || typeof s !== 'object') return false;
    const matchField = (field) => field && typeof field === 'string' && field.toLowerCase().includes(lowerQuery);
    const matchTags = Array.isArray(s.tags) && s.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(lowerQuery));
    return (
      matchField(s.name) ||
      matchField(s.title) ||
      matchField(s.description) ||
      matchField(s.breathline) ||
      matchField(s.vow) ||
      matchField(s.ache) ||
      matchTags
    );
  });
}

// Get all unique categories
export const scrollCategories = ['All', ...new Set(
  scrollRegistry
    .map(s => s.category)
    .filter(Boolean)
)];

// Get all unique tags
export const allTags = [...new Set(
  scrollRegistry
    .flatMap(s => s.tags || [])
    .filter(Boolean)
)];

// Statistics
export const stats = {
  totalScrolls: scrollRegistry.length,
  totalGlyphs: glyphRegistry.length,
  totalSigils: sigilRegistry.length,
  totalFragments: fragmentRegistry.length,
  totalData: dataRegistry.length,
  totalEntries: scrollRegistry.length + glyphRegistry.length + sigilRegistry.length + fragmentRegistry.length + dataRegistry.length
};

console.log('🕯️ Dynamic Loader Stats:', stats);
