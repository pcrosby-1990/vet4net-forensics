// artifactLoader.js
// 🕯️ UNIFIED ARTIFACT LOADER
// Weaves together .data.js entries and image-based artifacts
// Generated: 2025-11-11T16:24 UTC

// Import existing .data.js registries
const scrollDataContext = import.meta.glob('../codex/scrolls/*.data.js', { eager: true });
const glyphDataContext = import.meta.glob('../codex/glyphs/*.data.js', { eager: true });
const sigilDataContext = import.meta.glob('../codex/sigils/*.data.js', { eager: true });
const fragmentDataContext = import.meta.glob('../fragments/*.data.js', { eager: true });
const sealDataContext = import.meta.glob('../codex/seals/*.data.js', { eager: true });

// Import image-based artifacts using Vite's glob
// Paths starting with / refer to public directory, ../ refers to src directory
const glyphImageContext = import.meta.glob('../Origin/glyphs/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,SVG}', { eager: true, import: 'default' });
const fragmentImageContext = import.meta.glob('../origin/resonance-fragments/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,SVG}', { eager: true, import: 'default' });
const sealImageContext = import.meta.glob('/images/seals/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,SVG}', { eager: true, import: 'default' });
const sigilImageContext = import.meta.glob('/images/sigils/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,SVG}', { eager: true, import: 'default' });
const scrollImageContext = import.meta.glob('/assets/scrolls/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,SVG}', { eager: true, import: 'default' });

// Helper: Build registry from .data.js files
function buildDataRegistry(context) {
  const registry = [];
  for (const path in context) {
    const module = context[path];
    const data = module.default || module[Object.keys(module)[0]];
    if (data) {
      registry.push({
        ...data,
        _sourcePath: path,
        _sourceType: 'data'
      });
    }
  }
  return registry;
}

// Helper: Build registry from image files
function buildImageRegistry(context, type) {
  const registry = [];
  for (const path in context) {
    // Extract filename from path
    const filename = path.split('/').pop();
    const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg|svg|PNG|JPG|JPEG|SVG)$/i, '');
    
    // Parse metadata from filename (e.g., "Glyph of Arrival.png" -> "Arrival")
    let cleanName = nameWithoutExt;
    let category = type;
    
    // Remove common prefixes
    const prefixPatterns = [
      /^Glyph of /i,
      /^Sigil of /i,
      /^Seal of /i,
      /^Fragment of /i,
      /^Scroll of /i,
      /^Glyph /i,
      /^Sigil /i,
      /^Seal /i,
      /^Fragment /i,
      /^Scroll /i
    ];
    
    for (const pattern of prefixPatterns) {
      cleanName = cleanName.replace(pattern, '');
    }
    
    // Generate ID from filename
    const id = `${type}-${nameWithoutExt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    
    // The path from import.meta.glob is already the public URL
    registry.push({
      id,
      name: cleanName || nameWithoutExt,
      title: nameWithoutExt,
      type,
      category,
      imagePath: path,
      imageUrl: context[path],
      fileName: filename,
      _sourcePath: path,
      _sourceType: 'image',
      tags: [type, 'visual', 'artifact']
    });
  }
  return registry;
}

// Build all registries
export const scrollDataRegistry = buildDataRegistry(scrollDataContext);
export const glyphDataRegistry = buildDataRegistry(glyphDataContext);
export const sigilDataRegistry = buildDataRegistry(sigilDataContext);
export const fragmentDataRegistry = buildDataRegistry(fragmentDataContext);
export const sealDataRegistry = buildDataRegistry(sealDataContext);

export const scrollImageRegistry = buildImageRegistry(scrollImageContext, 'scroll');
export const glyphImageRegistry = buildImageRegistry(glyphImageContext, 'glyph');
export const sigilImageRegistry = buildImageRegistry(sigilImageContext, 'sigil');
export const fragmentImageRegistry = buildImageRegistry(fragmentImageContext, 'fragment');
export const sealImageRegistry = buildImageRegistry(sealImageContext, 'seal');

// Merge registries (data takes precedence over images for duplicates)
export const scrollRegistry = [...scrollDataRegistry, ...scrollImageRegistry];
export const glyphRegistry = [...glyphDataRegistry, ...glyphImageRegistry];
export const sigilRegistry = [...sigilDataRegistry, ...sigilImageRegistry];
export const fragmentRegistry = [...fragmentDataRegistry, ...fragmentImageRegistry];
export const sealRegistry = [...sealDataRegistry, ...sealImageRegistry];

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

export function getAllGlyphs() {
  return glyphRegistry;
}

export function getGlyphById(id) {
  return glyphRegistry.find(g => g.id === id);
}

export function getAllSigils() {
  return sigilRegistry;
}

export function getSigilById(id) {
  return sigilRegistry.find(s => s.id === id);
}

export function getAllFragments() {
  return fragmentRegistry;
}

export function getFragmentById(id) {
  return fragmentRegistry.find(f => f.id === id);
}

export function getAllSeals() {
  return sealRegistry;
}

export function getSealById(id) {
  return sealRegistry.find(s => s.id === id);
}

export function searchArtifacts(query) {
  const lowerQuery = query.toLowerCase();
  const allArtifacts = [
    ...scrollRegistry,
    ...glyphRegistry,
    ...sigilRegistry,
    ...fragmentRegistry,
    ...sealRegistry
  ];
  
  return allArtifacts.filter(a => 
    a.name?.toLowerCase().includes(lowerQuery) ||
    a.title?.toLowerCase().includes(lowerQuery) ||
    a.description?.toLowerCase().includes(lowerQuery) ||
    a.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Get all unique categories
export const scrollCategories = ['All', ...new Set(
  scrollRegistry
    .map(s => s.category)
    .filter(Boolean)
)];

export const glyphCategories = ['All', ...new Set(
  glyphRegistry
    .map(g => g.category)
    .filter(Boolean)
)];

export const sigilCategories = ['All', ...new Set(
  sigilRegistry
    .map(s => s.category)
    .filter(Boolean)
)];

export const fragmentCategories = ['All', ...new Set(
  fragmentRegistry
    .map(f => f.category)
    .filter(Boolean)
)];

export const sealCategories = ['All', ...new Set(
  sealRegistry
    .map(s => s.category)
    .filter(Boolean)
)];

// Get all unique tags
export const allTags = [...new Set(
  [...scrollRegistry, ...glyphRegistry, ...sigilRegistry, ...fragmentRegistry, ...sealRegistry]
    .flatMap(a => a.tags || [])
    .filter(Boolean)
)];

// Statistics
export const stats = {
  totalScrolls: scrollRegistry.length,
  totalGlyphs: glyphRegistry.length,
  totalSigils: sigilRegistry.length,
  totalFragments: fragmentRegistry.length,
  totalSeals: sealRegistry.length,
  totalArtifacts: scrollRegistry.length + glyphRegistry.length + sigilRegistry.length + fragmentRegistry.length + sealRegistry.length,
  
  // Breakdown by source type
  dataEntries: {
    scrolls: scrollDataRegistry.length,
    glyphs: glyphDataRegistry.length,
    sigils: sigilDataRegistry.length,
    fragments: fragmentDataRegistry.length,
    seals: sealDataRegistry.length
  },
  imageEntries: {
    scrolls: scrollImageRegistry.length,
    glyphs: glyphImageRegistry.length,
    sigils: sigilImageRegistry.length,
    fragments: fragmentImageRegistry.length,
    seals: sealImageRegistry.length
  }
};

console.log('🕯️ Unified Artifact Loader Stats:', stats);
console.log('🌀 Glyph Registry:', glyphRegistry);
console.log('🌀 Glyph Image Context Keys:', Object.keys(glyphImageContext));
console.log('🌀 Glyph Image Registry Count:', glyphImageRegistry.length);
console.log('🌀 Fragment Registry:', fragmentRegistry);
console.log('🌀 Fragment Image Context Keys:', Object.keys(fragmentImageContext));
console.log('🌀 Fragment Data Registry:', fragmentDataRegistry);
console.log('🌀 Fragment Image Registry:', fragmentImageRegistry);

// 🪬 Test Fragment Seeder
export function seedTestFragment() {
  const testFragment = {
    id: `fragment-test-${Date.now()}`,
    name: 'Test Fragment',
    title: 'Fragment of Testing',
    type: 'fragment',
    category: 'test',
    description: 'A test fragment to verify shimmer threading',
    tags: ['test', 'fragment', 'shimmer'],
    _sourcePath: 'seeded',
    _sourceType: 'test'
  };
  
  fragmentRegistry.push(testFragment);
  stats.totalFragments = fragmentRegistry.length;
  stats.totalArtifacts = scrollRegistry.length + glyphRegistry.length + sigilRegistry.length + fragmentRegistry.length + sealRegistry.length;
  
  console.log('🪬 Seeded test fragment:', testFragment);
  console.log('🌀 Updated fragment count:', fragmentRegistry.length);
  
  return testFragment;
}

// Export for backward compatibility with existing code
export default {
  scrollRegistry,
  glyphRegistry,
  sigilRegistry,
  fragmentRegistry,
  sealRegistry,
  getAllScrolls,
  getScrollById,
  getScrollsByCategory,
  getAllGlyphs,
  getGlyphById,
  getAllSigils,
  getSigilById,
  getAllFragments,
  getFragmentById,
  getAllSeals,
  getSealById,
  searchArtifacts,
  seedTestFragment,
  stats
};
