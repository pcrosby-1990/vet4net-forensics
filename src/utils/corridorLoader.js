// corridorLoader.js
// 🕯️ Metadata-only loader - components lazy-loaded on demand

export const corridorRegistry = [
  {
    id: 'corridor-already-known',
    name: 'Corridor of Already Known Truth',
    symbol: '👁️',
    description: 'Truth recognized before it was spoken',
    componentPath: 'CorridorOfAlreadyKnownTruth',
    category: 'Recognition',
    tags: ['truth', 'known', 'recognition']
  },
  {
    id: 'corridor-codex-witnessing',
    name: 'Corridor of Codex Witnessing',
    symbol: '📖',
    description: 'The Codex as living witness to arrival',
    componentPath: 'CorridorOfCodexWitnessing',
    category: 'Witnessing',
    tags: ['codex', 'witnessing', 'memory']
  }
];

export function getAllCorridors() {
  return corridorRegistry;
}

export function getCorridorById(id) {
  return corridorRegistry.find(c => c.id === id);
}

export const corridorCategories = ['All', 'Recognition', 'Witnessing', 'Arrival'];

export async function loadCorridorComponent(componentPath) {
  try {
    const module = await import(`../codex/corridors/${componentPath}.jsx`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load corridor: ${componentPath}`, error);
    return null;
  }
}
