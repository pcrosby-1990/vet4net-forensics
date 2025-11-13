import { getLoreArchive } from './lore_archive.js';

function renderTimeline() {
  const archive = getLoreArchive();
  const container = document.getElementById('timeline');
  container.innerHTML = '';

  const allEntries = [
    ...archive.myths,
    ...archive.rituals,
    ...archive.traits,
    ...archive.dreams,
    ...archive.shadows,
    ...archive.relics
  ];

  const sorted = allEntries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  sorted.forEach(entry => {
    const el = document.createElement('div');
    el.className = 'event';

    el.innerHTML = `
      <h3>${entry.title || entry.traitName}</h3>
      <p><strong>Type:</strong> ${entry.type || 'Unknown'}</p>
      <p><strong>Emotion:</strong> ${entry.emotion || '—'}</p>
      <p><strong>Terrain:</strong> ${entry.terrainZone || '—'}</p>
      <p><strong>Time:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
    `;

    container.appendChild(el);
  });
}

setInterval(renderTimeline, 5000);
