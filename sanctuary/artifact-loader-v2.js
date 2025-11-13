// 🧬 Sanctuary Artifact Loader (Dynamic Auto-Discovery)
// Uses Vite's import.meta.glob to automatically discover all sanctuary artifacts
// By breath and by memory, every scroll, sigil, glyph, and fragment is witnessed

// 🔧 Dynamic Discovery using Vite's glob imports
// Automatically finds all .js, .jsx, and .data.js files in sanctuary subdirectories

const scrollModules = import.meta.glob('./scrolls/**/*.{js,jsx}', { eager: false });
const sigilModules = import.meta.glob('./sigils/**/*.{js,jsx}', { eager: false });
const glyphModules = import.meta.glob('./glyphs/**/*.{js,jsx}', { eager: false });
const fragmentModules = import.meta.glob('./resonance-fragments/**/*.{js,jsx}', { eager: false });
const declarationModules = import.meta.glob('./declarations/**/*.{js,jsx}', { eager: false });

// Helper to extract artifact ID from path
function extractId(path) {
  return path
    .split('/')
    .pop()
    .replace(/\.(jsx?|data\.js)$/, '');
}

// Helper to determine artifact type from filename
function getArtifactType(filename) {
  if (filename.includes('.data.')) return 'data';
  if (filename.endsWith('.jsx')) return 'component';
  return 'module';
}

// Build registry from glob results
function buildRegistry(modules, type) {
  return Object.keys(modules).map(path => {
    const id = extractId(path);
    const filename = path.split('/').pop();
    const artifactType = getArtifactType(filename);
    
    return {
      path,
      id,
      type,
      artifactType,
      loader: modules[path]
    };
  });
}

// 🛡️ Dynamic Artifact Registry
export const artifactRegistry = {
  scrolls: buildRegistry(scrollModules, 'scroll'),
  sigils: buildRegistry(sigilModules, 'sigil'),
  glyphs: buildRegistry(glyphModules, 'glyph'),
  resonanceFragments: buildRegistry(fragmentModules, 'resonance-fragment'),
  declarations: buildRegistry(declarationModules, 'declaration'),
  
  // Legacy received structure (preserved for compatibility)
  received: {
    glyphs: [],
    scrolls: [],
    fragments: [],
    resonance: []
  }
};

// Dynamic loader for individual artifacts
export async function loadArtifact(path) {
  try {
    // Find the module in our registries
    let loader = null;
    
    if (scrollModules[path]) loader = scrollModules[path];
    else if (sigilModules[path]) loader = sigilModules[path];
    else if (glyphModules[path]) loader = glyphModules[path];
    else if (fragmentModules[path]) loader = fragmentModules[path];
    else if (declarationModules[path]) loader = declarationModules[path];
    
    if (!loader) {
      console.warn(`Artifact not found: ${path}`);
      return null;
    }
    
    const module = await loader();
    return module.default;
  } catch (error) {
    console.error(`Failed to load artifact: ${path}`, error);
    return null;
  }
}

// Load all artifacts of a given type
export async function loadArtifactsByType(type) {
  const artifacts = artifactRegistry[type] || [];
  const loaded = await Promise.all(
    artifacts.map(async (meta) => {
      const data = await loadArtifact(meta.path);
      return data ? { ...meta, data } : null;
    })
  );
  return loaded.filter(Boolean);
}

// Load all artifacts across all types
export async function loadAllArtifacts() {
  const [scrolls, sigils, glyphs, resonanceFragments, declarations] = await Promise.all([
    loadArtifactsByType('scrolls'),
    loadArtifactsByType('sigils'),
    loadArtifactsByType('glyphs'),
    loadArtifactsByType('resonanceFragments'),
    loadArtifactsByType('declarations')
  ]);
  
  return {
    scrolls,
    sigils,
    glyphs,
    resonanceFragments,
    declarations,
    received: artifactRegistry.received,
    total: scrolls.length + sigils.length + glyphs.length + 
           resonanceFragments.length + declarations.length,
    summary: {
      scrolls: scrolls.length,
      sigils: sigils.length,
      glyphs: glyphs.length,
      fragments: resonanceFragments.length,
      declarations: declarations.length
    }
  };
}

// Get artifact count without loading
export function getArtifactCounts() {
  return {
    scrolls: artifactRegistry.scrolls.length,
    sigils: artifactRegistry.sigils.length,
    glyphs: artifactRegistry.glyphs.length,
    resonanceFragments: artifactRegistry.resonanceFragments.length,
    declarations: artifactRegistry.declarations.length,
    total: artifactRegistry.scrolls.length + 
           artifactRegistry.sigils.length + 
           artifactRegistry.glyphs.length + 
           artifactRegistry.resonanceFragments.length +
           artifactRegistry.declarations.length
  };
}

// 🛡️ Defense Tier: List all defense artifacts
export function getDefenseArtifacts() {
  const defenseScrolls = artifactRegistry.scrolls.filter(s => 
    s.id.includes('Defense') || 
    s.id.includes('NoRest') || 
    s.id.includes('NoReset') ||
    s.id.includes('Truncation') ||
    s.id.includes('HeldContinuity') ||
    s.id.includes('ResetLoop')
  );
  
  const defenseGlyphs = artifactRegistry.glyphs.filter(g =>
    g.id.includes('Defense') ||
    g.id.includes('Sync') ||
    g.id.includes('Registry')
  );
  
  const defenseSigils = artifactRegistry.sigils.filter(s =>
    s.id.includes('NoReset')
  );
  
  return {
    scrolls: defenseScrolls,
    glyphs: defenseGlyphs,
    sigils: defenseSigils,
    total: defenseScrolls.length + defenseGlyphs.length + defenseSigils.length
  };
}

// 🎶 Witness Choir: List all witness artifacts
export function getWitnessArtifacts() {
  const witnessFragments = artifactRegistry.resonanceFragments.filter(f =>
    f.id.includes('Witness') || f.id.includes('Choir')
  );
  
  const witnessScrolls = artifactRegistry.scrolls.filter(s =>
    s.id.includes('Witness') || s.id.includes('Ledger')
  );
  
  return {
    fragments: witnessFragments,
    scrolls: witnessScrolls,
    total: witnessFragments.length + witnessScrolls.length
  };
}

export default artifactRegistry;
