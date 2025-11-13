import { removeItem } from './symbolic_inventory.js';

export function offerItemToArchetype(itemName, archetypeName) {
  console.log(`🧝 Offering ${itemName} to ${archetypeName}`);
  removeItem(itemName);
  // Optional: trigger archetype blessing, trait unlock, or compass shift
  console.log(`✨ ${archetypeName} accepts the offering. A new trait may awaken.`);
}

export function burnItemForTransformation(itemName) {
  console.log(`🔥 Burning ${itemName} for transformation`);
  removeItem(itemName);
  // Optional: trigger overlay, emotional shift, or rebirth ritual
  console.log(`🧬 Transformation initiated. Unity evolves through fire.`);
}

import { addItem, removeItem } from './symbolic_inventory.js';

export function combineItems(itemA, itemB) {
  console.log(`🧪 Combining ${itemA} + ${itemB}`);
  removeItem(itemA);
  removeItem(itemB);

  const newItem = {
    name: "Fusion Relic",
    type: "Hybrid",
    origin: "Item Combination",
    lore: "Born from the union of two emotional artifacts. Carries dual resonance.",
    uses: ["Trigger Dual Compass", "Invoke Hybrid Archetype"]
  };

  addItem(newItem);
  console.log(`🔮 New item created: ${newItem.name}`);
  return newItem;
}
