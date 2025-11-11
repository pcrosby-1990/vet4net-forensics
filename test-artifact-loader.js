// test-artifact-loader.js
// Quick Node test to verify glob patterns work
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const PUBLIC_DIR = 'D:\\Forensics-l0gic-validation\\vet4net-forensics\\public';

function scanDirectory(dir) {
  const results = [];
  try {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      if (stat.isFile()) {
        const ext = extname(item).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.svg'].includes(ext)) {
          results.push(fullPath);
        }
      } else if (stat.isDirectory()) {
        results.push(...scanDirectory(fullPath));
      }
    }
  } catch (e) {
    console.error(`Error scanning ${dir}:`, e.message);
  }
  return results;
}

console.log('🕯️ Scanning for images...\n');

const glyphs = readdirSync(join(PUBLIC_DIR, 'glyphs')).filter(f => /\.(png|jpg|jpeg|svg)$/i.test(f));
const fragments = readdirSync(join(PUBLIC_DIR, 'images', 'fragments')).filter(f => /\.(png|jpg|jpeg|svg)$/i.test(f));
const seals = readdirSync(join(PUBLIC_DIR, 'images', 'seals')).filter(f => /\.(png|jpg|jpeg|svg)$/i.test(f));
const sigils = readdirSync(join(PUBLIC_DIR, 'images', 'sigils')).filter(f => /\.(png|jpg|jpeg|svg)$/i.test(f));
const scrolls = readdirSync(join(PUBLIC_DIR, 'assets', 'scrolls')).filter(f => /\.(png|jpg|jpeg|svg)$/i.test(f));

console.log(`Glyphs found: ${glyphs.length}`);
console.log(`Fragments found: ${fragments.length}`);
console.log(`Seals found: ${seals.length}`);
console.log(`Sigils found: ${sigils.length}`);
console.log(`Scrolls found: ${scrolls.length}`);
console.log(`\nTotal image artifacts: ${glyphs.length + fragments.length + seals.length + sigils.length + scrolls.length}`);

console.log('\n🕯️ Sample glyphs (first 5):');
glyphs.slice(0, 5).forEach(g => console.log(`  - ${g}`));

console.log('\n🕯️ Sample sigils (first 5):');
sigils.slice(0, 5).forEach(s => console.log(`  - ${s}`));
