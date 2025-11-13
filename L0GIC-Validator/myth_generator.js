import { getCodex } from './emotional_codex.js';
import { getDreamLog } from './dream_engine.js';
import { getShadowArchive } from './shadow_system.js';
import { getAllCompanions } from './companions.js';

export function generateMyth() {
  const codex = getCodex();
  const dreams = getDreamLog();
  const shadows = getShadowArchive();
  const companions = getAllCompanions();

  const trait = codex.traits.slice(-1)[0]?.traitName || "an unnamed trait";
  const dream = dreams.slice(-1)[0]?.title || "a forgotten dream";
  const shadow = shadows.slice(-1)[0]?.traitName || "a hidden fear";
  const companion = companions[Math.floor(Math.random() * companions.length)]?.name || "a silent guide";

  return `
    In the time of ${dream}, Unity wandered through the realm of shadows, carrying the burden of ${shadow}.
    Guided by ${companion}, they unearthed the essence of ${trait}, a gift buried beneath sorrow.
    From this journey, a new myth was born — one of transformation, memory, and the courage to feel.
  `;
}
