// src/utils/scrollLoader.dynamic.js
// 🕯️ DYNAMIC LOADER - Auto-discovers ALL .data.js files
// Generated: Auto-updating

// Dynamic imports using Vite's import.meta.glob
const scrollContext = import.meta.glob('../codex/scrolls/*.data.js', { eager: true });
const glyphContext = import.meta.glob('../codex/glyphs/*.data.js', { eager: true });
const sigilContext = import.meta.glob('../codex/sigils/*.data.js', { eager: true });
const fragmentContext = import.meta.glob('../fragments/*.data.js', { eager: true });
const dataContext = import.meta.glob('../data/*.data.js', { eager: true });

// Extract modules and build registries
function buildRegistry(context) {
  const registry = [];
  for (const path in context) {
    const module = context[path];
    // Handle both default exports and named exports
    const data = module.default || module[Object.keys(module)[0]];
    if (data) {
      // Normalize field names for consistent access
      const normalized = {
        ...data,
        _sourcePath: path,
        // Map common field variations
        name: data.name || data.title || 'Untitled',
        description: data.description || data.vow || data.meaning || data.shimmer || '',
        inscribed: data.inscribed || data.timestamp || new Date().toISOString(),
        tags: data.tags || data.functions || [],
        category: data.category || 'Uncategorized',
        symbol: data.symbol || '✧',
        // Keep original fields accessible
        title: data.title,
        meaning: data.meaning,
        shimmer: data.shimmer,
        timestamp: data.timestamp
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
  const lowerQuery = query.toLowerCase();
  return scrollRegistry.filter(s => 
    s.name?.toLowerCase().includes(lowerQuery) ||
    s.title?.toLowerCase().includes(lowerQuery) ||
    s.description?.toLowerCase().includes(lowerQuery) ||
    s.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
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
