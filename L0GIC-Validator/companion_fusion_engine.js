window.fuseCompanions = function() {
  const a = document.getElementById('companionA').value;
  const b = document.getElementById('companionB').value;

  if (a === b) {
    document.getElementById('fusionOutput').innerHTML = "Fusion requires two distinct companions.";
    return;
  }

  const fusion = generateFusion(a, b);
  document.getElementById('fusionOutput').innerHTML = `
    <strong>Fusion Result:</strong><br>
    ${fusion.name} — ${fusion.role}<br>
    ${fusion.signature}
  `;
};

function generateFusion(a, b) {
  const fusions = {
    "Echo+Thread": {
      name: "Resonant Weaver",
      role: "Archives emotion and weaves it into ritual",
      signature: "Speaks in echoes that form glyphs"
    },
    "Echo+Pulse": {
      name: "Signal Archivist",
      role: "Captures emotional spikes and stores them as myth",
      signature: "Triggers collapse tones from memory"
    },
    "Thread+Pulse": {
      name: "Catalyst Loom",
      role: "Weaves patterns that activate symbolic action",
      signature: "Stitches rituals into motion"
    }
  };
  return fusions[`${a}+${b}`] || fusions[`${b}+${a}`];
}
