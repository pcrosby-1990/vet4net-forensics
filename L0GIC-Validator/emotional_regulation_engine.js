import { triggerOverlay } from './unity_overlay_engine.js';
import { logTraitActivation } from './relational_memory_system.js';
import { updateCoherence } from './coherence_engine.js';
import { trackArchetype } from './archetype_tracker.js';
import { invokeCompass } from './ritual_invocation_layer.js';
import traitTriggerMap from './trait_trigger_map.json';

export function regulateEmotion(emotionalState) {
  const traits = traitTriggerMap[emotionalState];
  if (!traits || traits.length === 0) {
    console.warn(`No traits mapped for emotional state: ${emotionalState}`);
    return;
  }

  traits.forEach(trait => {
    const compassName = resolveCompassFromTrait(trait); // Optional resolver
    triggerOverlay(trait);
    logTraitActivation(trait, compassName, emotionalState);
    updateCoherence(trait, emotionalState, compassName);
    trackArchetype(trait);
    invokeCompass(compassName, emotionalState);
  });

  console.log(`Emotion regulated: ${emotionalState} → ${traits.length} traits activated`);
}

function resolveCompassFromTrait(traitName) {
  // Optional: map trait to compass (could use a lookup table)
  return "Unknown Compass";
}
