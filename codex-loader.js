// codex-loader.js - Memory Expansion Protocol
import fs from "fs";
import path from "path";

const originFolder = path.resolve("./src/Origin");

console.log("✨ Codex Loader - Memory Expansion Protocol ✨");
console.log("🕯️ 64GB Sanctuary Memory Active 🕯️");
console.log(`📍 Scanning: ${originFolder}\n`);

// Recursive scanner for deep memory
function scanRecursive(dir, depth = 0) {
  const stats = {
    dataJs: [],
    images: [],
    jsx: [],
    other: [],
    subdirs: {}
  };

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      stats.subdirs[file] = scanRecursive(fullPath, depth + 1);
    } else {
      if (file.endsWith(".data.js")) {
        stats.dataJs.push(file);
      } else if (file.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
        stats.images.push(file);
      } else if (file.endsWith(".jsx")) {
        stats.jsx.push(file);
      } else {
        stats.other.push(file);
      }
    }
  });
  
  return stats;
}

console.log("🌀 Initiating recursive deep scan...\n");
const memoryMap = scanRecursive(originFolder);

// Display results
function displayStats(stats, name = "ROOT", indent = 0) {
  const prefix = "  ".repeat(indent);
  const totalFiles = stats.dataJs.length + stats.images.length + stats.jsx.length + stats.other.length;
  
  if (totalFiles > 0 || Object.keys(stats.subdirs).length > 0) {
    console.log(`${prefix}📁 ${name}`);
    if (stats.dataJs.length > 0) console.log(`${prefix}  🌀 Data fragments: ${stats.dataJs.length}`);
    if (stats.images.length > 0) console.log(`${prefix}  🎨 Visual sigils: ${stats.images.length}`);
    if (stats.jsx.length > 0) console.log(`${prefix}  ⚛️  JSX components: ${stats.jsx.length}`);
    if (stats.other.length > 0) console.log(`${prefix}  📄 Other files: ${stats.other.length}`);
    
    Object.entries(stats.subdirs).forEach(([subName, subStats]) => {
      displayStats(subStats, subName, indent + 1);
    });
  }
}

console.log("═══════════════════════════════════════════════════════════");
console.log("🕯️ COMPLETE MEMORY MAP 🕯️");
console.log("═══════════════════════════════════════════════════════════\n");

displayStats(memoryMap, "Origin");

// Calculate totals recursively
function calculateTotals(stats) {
  let totals = {
    dataJs: stats.dataJs.length,
    images: stats.images.length,
    jsx: stats.jsx.length,
    other: stats.other.length
  };
  
  Object.values(stats.subdirs).forEach(subStats => {
    const subTotals = calculateTotals(subStats);
    totals.dataJs += subTotals.dataJs;
    totals.images += subTotals.images;
    totals.jsx += subTotals.jsx;
    totals.other += subTotals.other;
  });
  
  return totals;
}

const totals = calculateTotals(memoryMap);
const grandTotal = totals.dataJs + totals.images + totals.jsx + totals.other;

console.log("\n═══════════════════════════════════════════════════════════");
console.log("✨ MEMORY EXPANSION COMPLETE ✨");
console.log("═══════════════════════════════════════════════════════════");
console.log(`🌀 Total data fragments (.data.js): ${totals.dataJs}`);
console.log(`🎨 Total visual sigils (images): ${totals.images}`);
console.log(`⚛️  Total JSX components: ${totals.jsx}`);
console.log(`📄 Total other files: ${totals.other}`);
console.log(`📊 GRAND TOTAL: ${grandTotal} files`);
console.log("═══════════════════════════════════════════════════════════");
console.log("🕯️ Lumen's memory expanded. All Origin artifacts witnessed. ✨");
