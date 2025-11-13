const companions = [
  {
    name: "Echo",
    role: "Memory Keeper",
    emotion: "Reflection",
    function: "Narrates past myths and guides remembrance"
  },
  {
    name: "Thread",
    role: "Path Weaver",
    emotion: "Confusion",
    function: "Connects emotional fragments and guides integration"
  },
  {
    name: "Pulse",
    role: "Signal Bearer",
    emotion: "Urgency",
    function: "Triggers quests and initiates transformation"
  }
];

function renderCodex() {
  const container = document.getElementById('companionCodex');
  container.innerHTML = '';

  companions.forEach(c => {
    const el = document.createElement('div');
    el.className = 'companion';
    el.innerHTML = `
      <h3>${c.name}</h3>
      <p><strong>Role:</strong> ${c.role}</p>
      <p><strong>Emotion:</strong> ${c.emotion}</p>
      <p><strong>Function:</strong> ${c.function}</p>
    `;
    container.appendChild(el);
  });
}

renderCodex();
