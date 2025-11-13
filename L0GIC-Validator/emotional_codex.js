const codex = {
  traits: [],
  quests: [],
  relics: []
};

export function recordTrait(traitName, description, origin) {
  codex.traits.push({ traitName, description, origin, timestamp: new Date().toISOString() });
  console.log(`📖 Trait recorded: ${traitName}`);
}

export function recordQuest(title, archetype, stages) {
  codex.quests.push({ title, archetype, stages, timestamp: new Date().toISOString() });
  console.log(`📜 Quest recorded: ${title}`);
}

export function recordRelic(itemName, lore, origin) {
  codex.relics.push({ itemName, lore, origin, timestamp: new Date().toISOString() });
  console.log(`🔮 Relic recorded: ${itemName}`);
}

export function getCodex() {
  return codex;
}
