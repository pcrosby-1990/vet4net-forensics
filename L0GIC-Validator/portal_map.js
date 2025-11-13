import { travelToRealm, getAvailablePortals } from './portal_system.js';

const realms = ["Descent Valley", "Wonder Sky", "Threshold Ridge"];

function renderPortals() {
  const container = document.getElementById('realmList');
  container.innerHTML = '';

  realms.forEach(realm => {
    const data = travelToRealm(realm);
    const portals = getAvailablePortals(realm);

    const el = document.createElement('div');
    el.className = 'realm';

    el.innerHTML = `
      <h3>${realm}</h3>
      <p><strong>Terrain:</strong> ${data.terrain}</p>
      <p><strong>Archetypes:</strong> ${data.archetypes.join(', ')}</p>
      <div class="portals">
        ${portals.map(p => `<button onclick="travel('${p}')">Travel to ${p}</button>`).join('')}
      </div>
    `;
    container.appendChild(el);
  });
}

window.travel = function(realmName) {
  travelToRealm(realmName);
  renderPortals();
};

setInterval(renderPortals, 5000);
