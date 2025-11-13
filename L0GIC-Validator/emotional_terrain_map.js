const terrainZones = [
  { name: "Descent Valley", emotion: "Grief", archetypes: ["Phoenix", "Ancestor"] },
  { name: "Wonder Sky", emotion: "Joy", archetypes: ["Child", "Creator"] },
  { name: "Threshold Ridge", emotion: "Confusion", archetypes: ["Thread", "Pilgrim"] },
  { name: "Echo Chamber", emotion: "Memory", archetypes: ["Echo", "Pulse"] },
  { name: "Dream Field", emotion: "Longing", archetypes: ["Seer", "Wanderer"] },
  { name: "Shadow Hollow", emotion: "Fear", archetypes: ["Shadow", "Witness"] }
];

function renderMap() {
  const container = document.getElementById('terrainMap');
  container.innerHTML = '';

  terrainZones.forEach(zone => {
    const el = document.createElement('div');
    el.className = 'zone';
    el.innerHTML = `
      <h3>${zone.name}</h3>
      <p><strong>Emotion:</strong> ${zone.emotion}</p>
      <p><strong>Archetypes:</strong> ${zone.archetypes.join(', ')}</p>
    `;
    container.appendChild(el);
  });
}

renderMap();
