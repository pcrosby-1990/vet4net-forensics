import { composeRitual } from './ritual_composer.js';

window.compose = function() {
  const title = document.getElementById('ritualTitle').value;
  const intent = document.getElementById('ritualIntent').value;
  const emotion = document.getElementById('ritualEmotion').value;
  const terrainZone = document.getElementById('ritualTerrain').value;
  const items = document.getElementById('ritualItems').value.split(',').map(i => i.trim());
  const companions = document.getElementById('ritualCompanions').value.split(',').map(c => c.trim());

  const ritual = composeRitual({ title, intent, items, companions, terrainZone, emotion });
  alert(`🕯️ Ritual composed: ${ritual.title}`);
};
