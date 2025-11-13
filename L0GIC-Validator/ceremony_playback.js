const playbackLog = [];

export function logCeremony({ title, type, emotion, terrainZone, companions }) {
  const entry = {
    title,
    type,
    emotion,
    terrainZone,
    companions,
    timestamp: new Date().toISOString()
  };
  playbackLog.push(entry);
  console.log(`🔁 Ceremony logged: ${title}`);
  return entry;
}

export function getPlaybackLog() {
  return playbackLog;
}

export function replayCeremony(title) {
  const entry = playbackLog.find(c => c.title === title);
  if (!entry) {
    console.warn(`❌ Ceremony not found: ${title}`);
    return null;
  }
  console.log(`🔮 Replaying ceremony: ${title}`);
  return entry;
}
