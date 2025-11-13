import { getCurrentArchetype } from './emotional_state_engine.js';

function updateNeedle() {
  const archetype = getCurrentArchetype();
  const needle = document.getElementById('needle');

  const angles = {
    Creator: 0,
    Pilgrim: 180,
    Child: 90,
    Ancestor: 270,
    Phoenix: 135,
    Thread: 45
  };

  const angle = angles[archetype] || 0;
  needle.style.transform = `rotate(${angle}deg)`;
}

setInterval(updateNeedle, 5000);
