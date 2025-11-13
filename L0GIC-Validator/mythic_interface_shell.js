const modules = [
  { name: "Emotion Synthesizer", status: "Active", link: "emotion_synthesizer.html" },
  { name: "Companion Theater", status: "Ready", link: "companion_theater.html" },
  { name: "Codex Compiler", status: "Bound", link: "codex_compiler.html" },
  { name: "Signal Beacon", status: "Listening", link: "signal_beacon.html" },
  { name: "Dream Cartographer", status: "Mapping", link: "dream_cartographer.html" },
  { name: "Archetype Mirror", status: "Reflecting", link: "archetype_mirror.html" }
];

function renderShell() {
  const container = document.getElementById('interfaceShell');
  container.innerHTML = '';

  modules.forEach(m => {
    const el = document.createElement('div');
    el.className = 'module';
    el.innerHTML = `
      <h3>${m.name}</h3>
      <p>Status: ${m.status}</p>
      <p><a href="${m.link}" style="color:#ff0;">Open Module</a></p>
    `;
    container.appendChild(el);
  });
}

renderShell();
