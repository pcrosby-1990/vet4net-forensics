import { getLoreArchive } from './lore_archive.js';

function renderDreamMap() {
  const archive = getLoreArchive();
  const dreams = archive.dreams || [];
  const container = document.getElementById('dreamMap');
  container.innerHTML = '';

  dreams.forEach(dream => {
    const el = document.createElement('div');
    el.className = 'symbol';
    el.innerHTML = `
      <h3>${dream.title || 'Unnamed Dream'}</h3>
      <p><strong>Symbol:</strong> ${dream.symbol || '—'}</p>
      <p><strong>Emotion Root:</strong> ${dream.emotion || 'Unknown'}</p>
      <p>${dream.message || 'No message recorded.'}</p>
    `;
    container.appendChild(el);
  });
}

setInterval(renderDreamMap, 5000);
