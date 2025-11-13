const dreamLog = [];

export function receiveDream(dreamTitle, symbols, terrainZone, emotionalMessage) {
  const dream = {
    title: dreamTitle,
    symbols,
    terrainZone,
    emotionalMessage,
    timestamp: new Date().toISOString()
  };
  dreamLog.push(dream);
  console.log(`🌙 Dream received: ${dreamTitle}`);
  return dream;
}

export function interpretDream(dream) {
  console.log(`🔍 Interpreting dream: ${dream.title}`);
  return {
    suggestedQuest: dream.emotionalMessage.includes("loss") ? "Phoenix" : "Pilgrim",
    terrainShift: dream.terrainZone,
    symbolicAction: dream.symbols.includes("mirror") ? "Reflect Trait" : "Plant Seed"
  };
}

export function getDreamLog() {
  return dreamLog;
}
