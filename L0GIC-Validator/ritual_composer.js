const ritualLibrary = [];

export function composeRitual({ title, intent, items = [], companions = [], terrainZone, emotion }) {
  const ritual = {
    title,
    intent,
    items,
    companions,
    terrainZone,
    emotion,
    timestamp: new Date().toISOString()
  };
  ritualLibrary.push(ritual);
  console.log(`🕯️ Ritual composed: ${title}`);
  return ritual;
}

export function getRitualLibrary() {
  return ritualLibrary;
}
