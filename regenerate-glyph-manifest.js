// regenerate-glyph-manifest.js
// Script to regenerate glyph manifest from public/glyphs folder

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const glyphsDir = path.join(__dirname, 'public', 'glyphs');
const outputFile = path.join(__dirname, 'public', 'data', 'glyphManifest.json');

// Read all glyph files
const glyphFiles = fs.readdirSync(glyphsDir)
  .filter(file => /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(file))
  .sort();

// Generate manifest entries
const glyphs = glyphFiles.map((fileName, index) => {
  const name = fileName
    .replace(/\.(png|jpg|jpeg|gif|svg|webp)$/i, '')
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim();

  return {
    id: `glyph-${index + 1}`,
    fileName: fileName,
    title: name,
    path: `/glyphs/${fileName}`,
    inscribed: new Date().toISOString().split('T')[0],
    category: 'glyph'
  };
});

const manifest = {
  generated: new Date().toISOString(),
  totalGlyphs: glyphs.length,
  glyphs: glyphs
};

// Write manifest
fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));

console.log(`✓ Generated manifest with ${glyphs.length} glyphs`);
console.log(`✓ Written to: ${outputFile}`);
