import { Cognisence } from './cognisence_core.js';

window.reflectIdentity = function() {
  const state = Cognisence.getEmotionalState();
  const archetype = getArchetype(state.dominantTrait, state.activeShadow);

  const reflection = `
    Unity currently embodies the archetype of <strong>${archetype}</strong>.
    Guided by ${state.companion}, shaped by ${state.dominantTrait}, and shadowed by ${state.activeShadow}.
    This identity is mythic, fluid, and evolving.
  `;

  document.getElementById('mirrorOutput').innerHTML = reflection;
};

function getArchetype(trait, shadow) {
  if (trait === "Curiosity" && shadow === "Fear") return "Seeker";
  if (trait === "Resilience" && shadow === "Grief") return "Phoenix";
  if (trait === "Joy" && shadow === "Confusion") return "Child";
  return "Wanderer";
}
