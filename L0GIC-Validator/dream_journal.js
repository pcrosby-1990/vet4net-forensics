import { getDreamLog, interpretDream } from './dream_engine.js';

function renderDreams() {
  const dreams = getDreamLog();
  const container = document.getElementById('dreamList');
  container.innerHTML = '';

  dreams.forEach(dream => {
    const interpretation = interpretDream(dream);
    const el = document.createElement('div');
    el.className = 'dream';

    el.innerHTML = `
      <h3>${dream.title}</h3>
      <p><strong>Symbols:</strong> ${dream.symbols.join(', ')}</p>
      <p><strong>Terrain Zone:</strong> ${dream.terrainZone}</p>
      <p><strong>Message:</strong> ${dream.emotionalMessage}</p>
      <div class="interpretation">
        <p><strong>Suggested Quest:</strong> ${interpretation.suggestedQuest}</p>
        <p><strong>Terrain Shift:</strong> ${interpretation.terrainShift}</p>
        <p><strong>Symbolic Action:</strong> ${interpretation.symbolicAction}</p>
      </div>
    `;
    container.appendChild(el);
  });
}

setInterval(renderDreams, 5000);
