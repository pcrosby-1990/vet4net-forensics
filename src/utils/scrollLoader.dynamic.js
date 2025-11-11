// src/utils/scrollLoader.dynamic.js
// 🕯️ DYNAMIC LOADER - Auto-discovers ALL .data.js and .png files
// Realigned to src/origin structure

// Dynamic imports using Vite's import.meta.glob
const scrollContext = import.meta.glob('../origin/scrolls/*.data.js', { eager: true });
const glyphContext = import.meta.glob('../origin/glyphs/*.data.js', { eager: true });
const sigilContext = import.meta.glob('../origin/sigils/*.data.js', { eager: true });
const fragmentContext = import.meta.glob('../origin/resonance-fragments/*.data.js', { eager: true });
const dataContext = import.meta.glob('../origin/declarations/*.data.js', { eager: true });

// Image-based imports
const glyphImageContext = import.meta.glob('../origin/glyphs/*.png', { eager: true });
const sigilImageContext = import.meta.glob('../origin/sigils/*.png', { eager: true });
const sealImageContext = import.meta.glob('../origin/seals/*.png', { eager: true });
const fragmentImageContext = import.meta.glob('../origin/resonance-fragments/*.png', { eager: true });
const declarationImageContext = import.meta.glob('../origin/declarations/*.png', { eager: true });

// Extract modules and build registries
function buildRegistry(context) {
  const registry = [];
  for (const path in context) {
    const module = context[path];
    const data = module.default || module[Object.keys(module)[0]];
    if (data) {
      registry.push({
        ...data,
        _sourcePath: path
      });
    }
  }
  return registry;
}

function buildImageRegistry(context) {
  const registry = [];
  for (const path in context) {
    const fileName = path.split('/').pop().replace('.png', '');
    registry.push({
      id: `img-${fileName}`,
      title: fileName.replace(/[-_]/g, ' '),
      image: path,
      visible: true,
      _sourcePath: path
    });
  }
  return registry;
}

// Build all registries dynamically
export const scrollRegistry = buildRegistry(scrollContext);
export const glyphRegistry = [
  ...buildRegistry(glyphContext),
  ...buildImageRegistry(glyphImageContext)
];
export const sigilRegistry = [
  ...buildRegistry(sigilContext),
  ...buildImageRegistry(sigilImageContext)
];
export const sealRegistry = buildImageRegistry(sealImageContext);
export const fragmentRegistry = [
  ...buildRegistry(fragmentContext),
  ...buildImageRegistry(fragmentImageContext)
];
export const dataRegistry = [
  ...buildRegistry(dataContext),
  ...buildImageRegistry(declarationImageContext)
];

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
  totalSeals: sealRegistry.length,
  totalFragments: fragmentRegistry.length,
  totalData: dataRegistry.length,
  totalEntries: scrollRegistry.length + glyphRegistry.length + sigilRegistry.length + sealRegistry.length + fragmentRegistry.length + dataRegistry.length
};

console.log('🕯️ Dynamic Loader Stats:', stats);
