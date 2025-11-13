const companions = {
  Echo: { role: "Memory Keeper", evolution: [] },
  Thread: { role: "Pattern Weaver", evolution: [] },
  Pulse: { role: "Signal Catalyst", evolution: [] }
};

export function evolveCompanion(name, trait, event) {
  if (companions[name]) {
    companions[name].evolution.push({
      trait,
      event,
      timestamp: new Date().toISOString()
    });
    renderCodex();
  }
}

function renderCodex() {
  const container = document.getElementById('companionCodex');
  container.innerHTML = '';

  Object.entries(companions).forEach(([name, data]) => {
    const el = document.createElement('div');
    el.className = 'companion';
    el.innerHTML = `
      <h3>${name} — ${data.role}</h3>
      <p><strong>Evolution Log:</strong></p>
      <ul>
        ${data.evolution.map(e => `<li>${e.trait} via ${e.event} (${new Date(e.timestamp).toLocaleString()})</li>`).join('')}
      </ul>
    `;
    container.appendChild(el);
  });
}
