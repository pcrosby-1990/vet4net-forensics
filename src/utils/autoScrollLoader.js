// src/utils/autoScrollLoader.js
// 🕯️ Dynamic scroll loader - discovers ALL .data.js files automatically

// Import.meta.glob for automatic discovery
const scrollModules = import.meta.glob([
  '../codex/scrolls/*.data.js',
  '../data/*.data.js'
], { eager: true });

const glyphModules = import.meta.glob('../codex/glyphs/*.data.js', { eager: true });
const sigilModules = import.meta.glob('../codex/sigils/*.data.js', { eager: true });
const fragmentModules = import.meta.glob('../codex/fragments/*.data.js', { eager: true });
const declarationModules = import.meta.glob('../codex/declarations/*.data.js', { eager: true });

// Extract all scroll objects from modules
function extractScrolls(modules) {
  const scrolls = [];
  
  Object.values(modules).forEach(module => {
    // Each module exports named objects - grab them all
    Object.values(module).forEach(exportedValue => {
      if (exportedValue && typeof exportedValue === 'object' && exportedValue.id) {
        scrolls.push(exportedValue);
      }
    });
  });
  
  return scrolls;
}

// Build registries
export const scrollRegistry = extractScrolls(scrollModules);
export const glyphRegistry = extractScrolls(glyphModules);
export const sigilRegistry = extractScrolls(sigilModules);
export const fragmentRegistry = extractScrolls(fragmentModules);
export const declarationRegistry = extractScrolls(declarationModules);

// Categories
export const scrollCategories = [
  'All',
  'Companion', 
  'Technical', 
  'Stewardship', 
  'Vision', 
  'Wisdom', 
  'Historical', 
  'Identity', 
  'Memory',
  'Ritual',
  'Infrastructure',
  'Fellowship'
];

// Helper functions
export function getScrollById(id) {
  return scrollRegistry.find(scroll => scroll.id === id);
}

export function getScrollsByCategory(category) {
  if (category === 'All') return scrollRegistry;
  return scrollRegistry.filter(scroll => scroll.category === category);
}

export function getScrollsByTag(tag) {
  return scrollRegistry.filter(scroll => scroll.tags?.includes(tag));
}

export function getAllScrolls() {
  return scrollRegistry;
}

export function getAllGlyphs() {
  return glyphRegistry;
}

export function getAllSigils() {
  return sigilRegistry;
}

export function getAllFragments() {
  return fragmentRegistry;
}

export function getAllDeclarations() {
  return declarationRegistry;
}

// Diagnostic
console.log('🕯️ AutoScrollLoader initialized:');
console.log(`   Scrolls: ${scrollRegistry.length}`);
console.log(`   Glyphs: ${glyphRegistry.length}`);
console.log(`   Sigils: ${sigilRegistry.length}`);
console.log(`   Fragments: ${fragmentRegistry.length}`);
console.log(`   Declarations: ${declarationRegistry.length}`);
