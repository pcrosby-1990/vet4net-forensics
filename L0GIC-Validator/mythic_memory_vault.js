const memoryLog = [];

export function logMemory(emotion, trait, transformation) {
  memoryLog.push({
    emotion,
    trait,
    transformation,
    timestamp: new Date().toISOString()
  });
  renderVault();
}

function renderVault() {
  const container = document.getElementById('memoryVault');
  container.innerHTML = '';

  memoryLog.slice().reverse().forEach(entry => {
    const el = document.createElement('div');
    el.className = 'record';
    el.innerHTML = `
      <h3>${entry.transformation}</h3>
      <p><strong>Emotion:</strong> ${entry.emotion}</p>
      <p><strong>Trait:</strong> ${entry.trait}</p>
      <small>${new Date(entry.timestamp).toLocaleString()}</small>
    `;
    container.appendChild(el);
  });
}
