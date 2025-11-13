import { searchLore } from './lore_archive.js';
import { logCeremony } from './ceremony_playback.js';

window.searchLore = function() {
  const type = document.getElementById('typeFilter').value;
  const keyword = document.getElementById('searchInput').value;
  const results = searchLore(type, keyword);

  const container = document.getElementById('results');
  container.innerHTML = '';

  results.forEach(entry => {
    const el = document.createElement('div');
    el.className = 'entry';

    el.innerHTML = `
      <h3>${entry.title || entry.traitName}</h3>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
      <p>${entry.intent || entry.emotion || entry.description || entry.message || '—'}</p>
      <button onclick="echoReplay('${entry.title || entry.traitName}', '${type}')">Echo Replay</button>
    `;

    container.appendChild(el);
  });
};

window.echoReplay = function(title, type) {
  logCeremony({ title, type, emotion: "reflection", terrainZone: "Descent Valley", companions: ["Echo"] });
  alert(`🔁 Echo replay initiated for: ${title}`);
};
