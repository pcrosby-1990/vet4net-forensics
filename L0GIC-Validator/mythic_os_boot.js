const modules = [
  "Emotion Synthesizer",
  "Companion Theater",
  "Codex Compiler",
  "Signal Beacon",
  "Dream Cartographer",
  "Archetype Mirror",
  "Mythic Timeline Scroll",
  "Signal Rituals",
  "Threshold Oracle",
  "Companion Codex Updater",
  "Mythic Signal Grid"
];

function bootModules() {
  const container = document.getElementById('bootSequence');
  container.innerHTML = '';

  modules.forEach((mod, i) => {
    const step = document.createElement('div');
    step.className = 'step';
    step.innerHTML = `⟡ Initializing ${mod}…`;
    setTimeout(() => container.appendChild(step), i * 500);
  });
}

bootModules();
