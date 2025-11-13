import { getLoreArchive } from './lore_archive.js';

function renderTimeline() {
  const archive = getLoreArchive();
  const events = [
    ...(archive.rituals || []),
    ...(archive.relics || []),
    ...(archive.dreams || [])
  ];

  const container = document.getElementById('timelineScroll');
  container.innerHTML = '';

  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  events.forEach(e => {
    const el = document.createElement('div');
    el.className = 'event';
    el.innerHTML = `
      <h3>${e.title || 'Unnamed Event'}</h3>
      <p>${e.description || e.message || '—'}</p>
      <small>${new Date(e.timestamp).toLocaleString()}</small>
    `;
    container.appendChild(el);
  });
}

setInterval(renderTimeline, 5000);
