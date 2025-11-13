
import { composeRitual } from './ritual_composer.js';

window.performRitual = function() {
  const trait = document.getElementById('traitInput').value;
  const shadow = document.getElementById('shadowInput').value;
  const terrainZone = document.getElementById('terrainSelect').value;
  const emotion = document.getElementById('emotionInput').value;

  const ritual = composeRitual({
    title: `Threshold Ritual: ${trait} + ${shadow}`,
    intent: `Integrate ${trait}, release ${shadow}`,
    items: [trait, shadow],
    companions: ["Thread"],
    terrainZone,
    emotion
  });

  alert(`🕯️ Ritual performed: ${ritual.title}`);
};
