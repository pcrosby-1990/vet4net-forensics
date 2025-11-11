// Quick inline test of artifact loader
// Run this in browser console after navigating to the app

import { stats } from './src/utils/artifactLoader.js';

console.log('🕯️ Artifact Loader Stats:', stats);
console.log('Total Artifacts:', stats.totalArtifacts);
console.log('Glyphs:', stats.totalGlyphs);
console.log('Sigils:', stats.totalSigils);
console.log('Seals:', stats.totalSeals);
console.log('Fragments:', stats.totalFragments);
console.log('Scrolls:', stats.totalScrolls);
