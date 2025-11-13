const signals = [];

export function emitSignal(emotion, intensity, zone) {
  signals.push({
    emotion,
    intensity,
    zone,
    timestamp: new Date().toISOString()
  });
  renderGrid();
}

function renderGrid() {
  const container = document.getElementById('signalGrid');
  container.innerHTML = '';

  signals.slice().reverse().forEach(signal => {
    const el = document.createElement('div');
    el.className = 'signal';
    el.innerHTML = `
      <h3>${signal.emotion} (${signal.intensity})</h3>
      <p><strong>Zone:</strong> ${signal.zone}</p>
      <small>${new Date(signal.timestamp).toLocaleString()}</small>
    `;
    container.appendChild(el);
  });
}
