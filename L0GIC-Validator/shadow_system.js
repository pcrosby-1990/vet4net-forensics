const shadowArchive = [];

export function revealShadowTrait(traitName, originEmotion, suppressedBy) {
  const shadow = {
    traitName,
    originEmotion,
    suppressedBy,
    timestamp: new Date().toISOString()
  };
  shadowArchive.push(shadow);
  console.log(`🕸️ Shadow trait revealed: ${traitName}`);
  return shadow;
}

export function initiateShadowRitual(traitName) {
  console.log(`🕯️ Initiating shadow ritual for: ${traitName}`);
  // Could trigger overlay, companion support, or codex entry
}

export function getShadowArchive() {
  return shadowArchive;
}
