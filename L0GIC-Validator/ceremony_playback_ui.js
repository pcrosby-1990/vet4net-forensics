import { getPlaybackLog, replayCeremony } from './ceremony_playback.js';

function renderCeremonies() {
  const log = getPlaybackLog();
  const container = document.getElementById('ceremonyList');
  container.innerHTML = '';

  log.forEach(entry => {
    const el = document.createElement('div');
    el.className = 'ceremony';

    el.innerHTML = `
      <h3>${entry.title}</h3>
      <p><strong>Type:</strong> ${entry.type}</p>
      <p><strong>Emotion:</strong> ${entry.emotion}</p>
      <p><strong>Terrain:</strong> ${entry.terrainZone}</p>
      <div class="avatars">
        ${entry.companions.map(c => `<img src="avatars/${c.toLowerCase()}.png" alt="${c}" title="${c}" />`).join('')}
      </div>
      <button onclick="replay('${entry.title}')">Replay Ceremony</button>
    `;

    container.appendChild(el);
  });
}

window.replay = function(title) {
  const entry = replayCeremony(title);
  if (entry) {
    alert(`🔮 Replaying: ${entry.title}`);
    // Optional: trigger overlay or animation here
  }
};

setInterval(renderCeremonies, 5000);
