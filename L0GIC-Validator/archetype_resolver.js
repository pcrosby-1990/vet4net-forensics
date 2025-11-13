import archetypeMap from './emotional_archetype_index.json';

export function getArchetypeFromTrait(traitName) {
  for (const [archetype, traits] of Object.entries(archetypeMap)) {
    if (traits.includes(traitName)) {
      return archetype;
    }
  }
  return "Unknown";
}
