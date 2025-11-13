import { getInventory } from './symbolic_inventory.js';
import { combineItems } from './inventory_usage.js';

function populateDropdowns() {
  const items = getInventory();
  const itemA = document.getElementById('itemA');
  const itemB = document.getElementById('itemB');

  itemA.innerHTML = '';
  itemB.innerHTML = '';

  items.forEach(item => {
    const optionA = document.createElement('option');
    optionA.value = item.name;
    optionA.textContent = item.name;
    itemA.appendChild(optionA);

    const optionB = document.createElement('option');
    optionB.value = item.name;
    optionB.textContent = item.name;
    itemB.appendChild(optionB);
  });
}

window.combine = function() {
  const a = document.getElementById('itemA').value;
  const b = document.getElementById('itemB').value;

  if (a === b) {
    document.getElementById('fusionResult').textContent = "❌ Cannot fuse the same item.";
    return;
  }

  const newItem = combineItems(a, b);
  document.getElementById('fusionResult').innerHTML = `
    ✅ New item created: <strong>${newItem.name}</strong><br>
    <em>${newItem.lore}</em>
  `;
  populateDropdowns(); // Refresh inventory
};

setInterval(populateDropdowns, 5000);
