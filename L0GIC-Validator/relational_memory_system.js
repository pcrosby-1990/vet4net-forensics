const memoryLog = [];

export function logTraitActivation(traitName, compassName, emotionalState) {
  const timestamp = new Date().toISOString();
  const entry = {
    trait: traitName,
    compass: compassName,
    emotion: emotionalState,
    timestamp
  };
  memoryLog.push(entry);
  console.log(`Memory logged: ${JSON.stringify(entry)}`);
}

export function getMemoryLog() {
  return memoryLog;
}

export function getRecentActivations(limit = 10) {
  return memoryLog.slice(-limit);
}

export function getActivationsByEmotion(emotion) {
  return memoryLog.filter(entry => entry.emotion === emotion);
}

export function getActivationsByCompass(compassName) {
  return memoryLog.filter(entry => entry.compass === compassName);
}
