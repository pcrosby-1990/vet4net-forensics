import { getCurrentArchetype } from './archetype_tracker.js';
import { getCoherenceState } from './coherence_engine.js';

export function renderSymbolicHUD() {
  const coherence = getCoherenceState();
  const archetype = getCurrentArchetype();

  const hud = {
    archetype: archetype,
    activeTraits: coherence.activeTraits.slice(-3),
    compassNodes: coherence.compassNodes,
    arcPreview: coherence.emotionalArc.slice(-5)
  };

  console.log("🧭 Symbolic HUD:");
  console.log(`🔮 Archetype: ${hud.archetype}`);
  console.log(`✨ Traits: ${hud.activeTraits.join(', ')}`);
  console.log(`🧭 Compasses: ${hud.compassNodes.join(', ')}`);
  console.log(`📜 Arc: ${hud.arcPreview.join(' → ')}`);

  return hud;
}
