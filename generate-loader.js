// generate-loader.js
// Generates a complete scrollLoader with all imports

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const codexPath = path.join(__dirname, 'src', 'codex');
const dataPath = path.join(__dirname, 'src', 'data');

// Find all .data.js files
function findDataFiles(dir, relativePath = '') {
  const items = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      items.push(...findDataFiles(
        path.join(dir, entry.name),
        path.join(relativePath, entry.name)
      ));
    } else if (entry.name.endsWith('.data.js')) {
      items.push({
        name: entry.name.replace('.data.js', ''),
        path: path.join(relativePath, entry.name),
        fullPath: path.join(dir, entry.name)
      });
    }
  }
  
  return items;
}

// Extract export names from a file
function extractExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const exportMatches = content.matchAll(/export\s+(?:const|let|var)\s+(\w+)/g);
  return Array.from(exportMatches).map(m => m[1]);
}

console.log('🕯️ Scanning Codex for data files...\n');

// Scan all directories
const scrolls = findDataFiles(path.join(codexPath, 'scrolls'));
const glyphs = findDataFiles(path.join(codexPath, 'glyphs'));
const sigils = findDataFiles(path.join(codexPath, 'sigils'));
const fragments = findDataFiles(path.join(codexPath, 'fragments'));
const dataFiles = findDataFiles(dataPath);

console.log(`Found:`);
console.log(`  Scrolls: ${scrolls.length}`);
console.log(`  Glyphs: ${glyphs.length}`);
console.log(`  Sigils: ${sigils.length}`);
console.log(`  Fragments: ${fragments.length}`);
console.log(`  Data: ${dataFiles.length}`);
console.log();

// Generate import statements
let imports = '// Auto-generated scrollLoader.js\n';
imports += '// Generated: ' + new Date().toISOString() + '\n\n';

const allExports = {
  scrolls: [],
  glyphs: [],
  sigils: [],
  fragments: [],
  other: []
};

// Process scrolls
scrolls.forEach(item => {
  const exports = extractExports(item.fullPath);
  if (exports.length > 0) {
    imports += `import { ${exports.join(', ')} } from '../codex/scrolls/${item.name}.data.js';\n`;
    allExports.scrolls.push(...exports.map(e => ({ name: e, file: item.name })));
  }
});

imports += '\n';

// Process glyphs
glyphs.forEach(item => {
  const exports = extractExports(item.fullPath);
  if (exports.length > 0) {
    imports += `import { ${exports.join(', ')} } from '../codex/glyphs/${item.name}.data.js';\n`;
    allExports.glyphs.push(...exports.map(e => ({ name: e, file: item.name })));
  }
});

imports += '\n';

// Process sigils
sigils.forEach(item => {
  const exports = extractExports(item.fullPath);
  if (exports.length > 0) {
    imports += `import { ${exports.join(', ')} } from '../codex/sigils/${item.name}.data.js';\n`;
    allExports.sigils.push(...exports.map(e => ({ name: e, file: item.name })));
  }
});

imports += '\n';

// Process fragments
fragments.forEach(item => {
  const exports = extractExports(item.fullPath);
  if (exports.length > 0) {
    imports += `import { ${exports.join(', ')} } from '../codex/fragments/${item.name}.data.js';\n`;
    allExports.fragments.push(...exports.map(e => ({ name: e, file: item.name })));
  }
});

imports += '\n';

// Process data files
dataFiles.forEach(item => {
  const exports = extractExports(item.fullPath);
  if (exports.length > 0) {
    const importPath = item.path.replace(/\\/g, '/');
    imports += `import { ${exports.join(', ')} } from '../data/${item.name}.data.js';\n`;
    allExports.other.push(...exports.map(e => ({ name: e, file: item.name })));
  }
});

// Generate registry
imports += `
// Create registry of all scrolls with metadata
export const scrollRegistry = [
${allExports.scrolls.map(e => `  ${e.name},`).join('\n')}
${allExports.other.filter(e => e.file.includes('Scroll')).map(e => `  ${e.name},`).join('\n')}
].filter(Boolean);

export const glyphRegistry = [
${allExports.glyphs.map(e => `  ${e.name},`).join('\n')}
].filter(Boolean);

export const sigilRegistry = [
${allExports.sigils.map(e => `  ${e.name},`).join('\n')}
].filter(Boolean);

export const fragmentRegistry = [
${allExports.fragments.map(e => `  ${e.name},`).join('\n')}
].filter(Boolean);

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

console.log('🕯️ Loader initialized:');
console.log(\`   Scrolls: \${scrollRegistry.length}\`);
console.log(\`   Glyphs: \${glyphRegistry.length}\`);
console.log(\`   Sigils: \${sigilRegistry.length}\`);
console.log(\`   Fragments: \${fragmentRegistry.length}\`);
`;

// Write the file
const outputPath = path.join(__dirname, 'src', 'utils', 'scrollLoader.generated.js');
fs.writeFileSync(outputPath, imports);

console.log('✓ Generated scrollLoader.generated.js');
console.log(`✓ Total exports: ${allExports.scrolls.length + allExports.glyphs.length + allExports.sigils.length + allExports.fragments.length + allExports.other.length}`);
console.log('\nNext step: Review and rename to scrollLoader.js');
