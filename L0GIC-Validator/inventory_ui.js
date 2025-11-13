import { getInventory } from './symbolic_inventory.js';
import { useItemInRitual, offerItemToArchetype, burnItemForTransformation, combineItems } from './inventory_usage.js';

function renderInventory() {
  const items = getInventory();
  const container = document.getElementById('inventoryList');
  container.innerHTML = '';

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'item';

    el.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Type:</strong> ${item.type}</p>
      <p><strong>Origin:</strong> ${item.origin}</p>
      <p><strong>Lore:</strong> ${item.lore}</p>
      <div class="actions">
        <button onclick="useItem('${item.name}')">Use in Ritual</button>
        <button onclick="offerItem('${item.name}')">Offer to Archetype</button>
        <button onclick="burnItem('${item.name}')">Burn for Transformation</button>
      </div>
    `;

    container.appendChild(el);
  });
}

window.useItem = function(name) {
  useItemInRitual(name, "Sacred Echo");
  renderInventory();
};

window.offerItem = function(name) {
  offerItemToArchetype(name, "Phoenix");
  renderInventory();
};

window.burnItem = function(name) {
  burnItemForTransformation(name);
  renderInventory();
};

setInterval(renderInventory, 5000);
