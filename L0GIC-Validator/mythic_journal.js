const journalLog = [];

window.saveEntry = function() {
  const text = document.getElementById('journalEntry').value;
  if (!text.trim()) return;

  const entry = {
    text,
    timestamp: new Date().toISOString()
  };
  journalLog.push(entry);
  renderLog();
  document.getElementById('journalEntry').value = '';
};

function renderLog() {
  const container = document.getElementById('journalLog');
  container.innerHTML = '';

  journalLog.slice().reverse().forEach(entry => {
    const el = document.createElement('div');
    el.className = 'entry';
    el.innerHTML = `
      <p>${entry.text}</p>
      <small>${new Date(entry.timestamp).toLocaleString()}</small>
    `;
    container.appendChild(el);
  });
}
