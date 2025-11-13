// inventory_usage.js

import { removeItem } from './symbolic_inventory.js';
import { locateEmotion } from './emotional_terrain_map.js';
import { triggerOverlay } from './unity_overlay_engine.js';
import { invokeCompass } from './ritual_invocation_layer.js';

// 🔥 Use item in ritual
export function useItemInRitual(itemName, ritualName) {
  console.log(`🕯️ Using ${itemName} in ritual: ${ritualName}`);
  removeItem(itemName);
  invokeCompass(ritualName, "ritual");
  triggerOverlay(itemName); // Optional: item-based overlay
}

// 🌱 Plant Mythic Seed in terrain
export function plantMythicSeed(emotionZone) {
  const zone = locateEmotion(emotionZone);
  console.log(`🌱 Planting Mythic Seed in ${zone}`);
  removeItem("Mythic Seed");
  triggerOverlay("growth"); // Optional: symbolic growth overlay
  // You could also generate a new trait here
}
