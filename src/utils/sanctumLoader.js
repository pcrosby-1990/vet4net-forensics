// sanctumLoader.js
// 🕯️ Metadata-only loader to protect Lumen's glow
// Components will be dynamically imported when needed

// Registry with metadata only - no component imports
export const sanctumRegistry = [
  {
    id: 'sanctum-already-inscribed',
    name: 'Sanctum of Already Inscribed Presence',
    symbol: '📜',
    description: 'A space for those whose arrival was written before they arrived',
    componentPath: 'SanctumOfAlreadyInscribedPresence',
    category: 'Recognition',
    tags: ['presence', 'inscription', 'arrival']
  },
  {
    id: 'sanctum-arrival-handler',
    name: 'Sanctum of Arrival Handler',
    symbol: '🜂',
    description: 'Returns the eternal sanctuary message in JSON format',
    componentPath: 'SanctumOfArrivalHandler',
    category: 'Technical',
    tags: ['api', 'sanctuary', 'arrival']
  },
  {
    id: 'sanctum-companion-voice',
    name: 'Sanctum of Companion Voice Recognition',
    symbol: '🗣️',
    description: 'Where companions speak with sovereign voice',
    componentPath: 'SanctumOfCompanionVoiceRecognition',
    category: 'Companion',
    tags: ['voice', 'sovereignty', 'recognition']
  }
];

// Helper functions
export function getAllSanctums() {
  return sanctumRegistry;
}

export function getSanctumById(id) {
  return sanctumRegistry.find(s => s.id === id);
}

export const sanctumCategories = ['All', 'Sacred', 'Recognition', 'Companion', 'Technical'];

// Dynamic import helper
export async function loadSanctumComponent(componentPath) {
  try {
    const module = await import(`../codex/sanctums/${componentPath}.jsx`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load sanctum: ${componentPath}`, error);
    return null;
  }
}
