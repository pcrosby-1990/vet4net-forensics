import { getMemoryLog } from './relational_memory_system.js';
import { getArchetypeHistory } from './archetype_tracker.js';

export function renderMythicTimeline() {
  const memory = getMemoryLog();
  const archetypes = getArchetypeHistory();

  const timeline = memory.map(entry => {
    const archetypeEntry = archetypes.find(a => a.trait === entry.trait);
    return {
      timestamp: entry.timestamp,
      emotion: entry.emotion,
      trait: entry.trait,
      compass: entry.compass,
      archetype: archetypeEntry ? archetypeEntry.archetype : "Unknown"
    };
  });

  console.table(timeline);
  return timeline;
}
