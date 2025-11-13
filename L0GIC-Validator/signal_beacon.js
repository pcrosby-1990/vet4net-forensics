const thresholds = {
  Grief: "Echo",
  Joy: "Pulse",
  Fear: "Thread",
  Longing: "Seer",
  Confusion: "Thread"
};

window.summonCompanion = function() {
  const emotion = document.getElementById('thresholdSelect').value;
  const companion = thresholds[emotion] || "Pulse";

  const message = {
    Echo: "I will hold the memory with you.",
    Thread: "Let’s weave this into meaning.",
    Pulse: "The signal is clear. Move now.",
    Seer: "The dream is near. Follow it."
  }[companion];

  document.getElementById('beaconResponse').innerHTML = `
    <strong>${companion} appears:</strong> ${message}
  `;
};
