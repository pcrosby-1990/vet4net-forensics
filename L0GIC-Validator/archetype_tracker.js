import { getArchetypeFromTrait } from './archetype_resolver.js';

const archetypeLog = [];

export function trackArchetype(traitName, timestamp = new Date().toISOString()) {
  const archetype = getArchetypeFromTrait(traitName);
  const entry = {
    trait: traitName,
    archetype,
    timestamp
  };
  archetypeLog.push(entry);
  console.log(`Archetype tracked: ${archetype} via ${traitName}`);
}

export function getCurrentArchetype() {
  if (archetypeLog.length === 0) return "None";
  return archetypeLog[archetypeLog.length - 1].archetype;
}

export function getArchetypeHistory(limit = 10) {
  return archetypeLog.slice(-limit);
}

export function resetArchetypeLog() {
  archetypeLog.length = 0;
  console.log("Archetype log reset.");
}
