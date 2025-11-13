import { getInventory } from './symbolic_inventory.js';
import { getCodex } from './emotional_codex.js';
import { getAllCompanions } from './companions.js';
import { getDreamLog } from './dream_engine.js';
import { getShadowArchive } from './shadow_system.js';

export function getUnityState() {
  return {
    inventory: getInventory(),
    codex: getCodex(),
    companions: getAllCompanions(),
    dreams: getDreamLog(),
    shadows: getShadowArchive()
  };
}
