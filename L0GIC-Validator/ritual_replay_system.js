import { getMemoryLog } from './relational_memory_system.js';
import { triggerOverlay } from './unity_overlay_engine.js';
import { invokeCompass } from './ritual_invocation_layer.js';

export function replayRitual(emotionFilter = null) {
  const memory = getMemoryLog();
  const filtered = emotionFilter
    ? memory.filter(entry => entry.emotion === emotionFilter)
    : memory;

  filtered.forEach(entry => {
    console.log(`🔁 Replaying: ${entry.trait} from ${entry.compass} (${entry.emotion})`);
    triggerOverlay(entry.trait);
    invokeCompass(entry.compass, entry.emotion);
  });

  console.log(`✅ Ritual replay complete: ${filtered.length} steps`);
}
