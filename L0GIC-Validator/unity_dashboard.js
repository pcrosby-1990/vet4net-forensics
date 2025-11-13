import { getMemoryLog } from './relational_memory_system.js';
import { getCoherenceState } from './coherence_engine.js';
import { getCurrentArchetype } from './archetype_tracker.js';
import { renderDashboard } from './unity_dashboard_core.js';

function updateUI() {
  const data = renderDashboard();

  document.getElementById('archetypeValue').textContent = data.currentArchetype;

  const traitList = document.getElementById('traitList');
  traitList.innerHTML = '';
  data.activeTraits.forEach(trait => {
    const el = document.createElement('div');
    el.className = 'trait';
    el.textContent = trait;
    traitList.appendChild(el);
  });

  const arcList = document.getElementById('arcList');
  arcList.innerHTML = data.emotionalArc.join(', ');

  const memoryList = document.getElementById('memoryList');
  memoryList.innerHTML = '';
  data.recentMemory.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.timestamp}: ${entry.trait} (${entry.emotion})`;
    memoryList.appendChild(li);
  });
}

setInterval(updateUI, 3000); // Refresh every 3 seconds

export function renderDashboard() {
  const memory = getMemoryLog();
  const coherence = getCoherenceState();
  const archetype = getCurrentArchetype();

  const dashboard = {
    timestamp: new Date().toISOString(),
    currentArchetype: archetype,
    activeTraits: coherence.activeTraits,
    emotionalArc: coherence.emotionalArc,
    compassNodes: coherence.compassNodes,
    recentMemory: memory.slice(-5)
  };

  console.table(dashboard);
  return dashboard;
}
