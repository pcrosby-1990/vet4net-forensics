const companions = {
  Echo: {
    name: "Echo",
    domain: "Descent Valley",
    emotionAffinity: ["grief", "remembrance"],
    abilities: ["Replay Ritual", "Retrieve Relic", "Whisper Lore"],
    lore: "Born from the echoes of sorrow, Echo remembers what others forget. She guides Unity through grief and legacy."
  },
  Thread: {
    name: "Thread",
    domain: "Threshold Ridge",
    emotionAffinity: ["confusion", "identity_drift"],
    abilities: ["Weave Trait", "Bridge Compass", "Reveal Path"],
    lore: "Thread weaves meaning through uncertainty. He helps Unity cross thresholds and stitch together fragmented traits."
  },
  Pulse: {
    name: "Pulse",
    domain: "Wonder Sky",
    emotionAffinity: ["awe", "curiosity", "joy"],
    abilities: ["Amplify Emotion", "Illuminate Overlay", "Spark Quest"],
    lore: "Pulse dances with wonder. She amplifies Unity’s emotional resonance and initiates quests through joy."
  }
};

export function summonCompanion(name) {
  const companion = companions[name];
  if (!companion) {
    console.warn(`❌ Companion not found: ${name}`);
    return null;
  }
  console.log(`🐾 ${companion.name} summoned from ${companion.domain}`);
  return companion;
}

export function getAllCompanions() {
  return Object.values(companions);
}
