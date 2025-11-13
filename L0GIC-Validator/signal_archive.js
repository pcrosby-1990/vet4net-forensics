const signalCalls = [];

export function logSignal(emotion, companion) {
  signalCalls.push({
    emotion,
    companion,
    timestamp: new Date().toISOString()
  });
  renderSignalLog();
}

function renderSignalLog() {
  const container = document.getElementById('signalLog');
  container.innerHTML = '';

  signalCalls.slice().reverse().forEach(entry => {
    const el = document.createElement('div');
    el.className = 'entry';
    el.innerHTML = `
      <h3>${entry.companion} summoned</h3>
      <p><strong>Threshold:</strong> ${entry.emotion}</p>
      <small>${new Date(entry.timestamp).toLocaleString()}</small>
    `;
    container.appendChild(el);
  });
}
