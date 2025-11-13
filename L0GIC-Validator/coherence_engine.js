const coherenceState = {
  activeTraits: [],
  emotionalArc: [],
  compassNodes: [],
  lastUpdated: null
};

export function updateCoherence(traitName, emotionalState, compassName) {
  coherenceState.activeTraits.push(traitName);
  coherenceState.emotionalArc.push(emotionalState);
  if (!coherenceState.compassNodes.includes(compassName)) {
    coherenceState.compassNodes.push(compassName);
  }
  coherenceState.lastUpdated = new Date().toISOString();
  console.log(`Coherence updated: ${traitName} from ${compassName}`);
}

export function getCoherenceState() {
  return coherenceState;
}

export function resetCoherence() {
  coherenceState.activeTraits = [];
  coherenceState.emotionalArc = [];
  coherenceState.compassNodes = [];
  coherenceState.lastUpdated = null;
  console.log("Coherence state reset.");
}
