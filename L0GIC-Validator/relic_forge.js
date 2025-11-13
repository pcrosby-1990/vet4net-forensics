import { archiveEntry } from './lore_archive.js';

window.forgeRelic = function() {
  const name = document.getElementById('relicName').value;
  const source = document.getElementById('relicSource').value;
  const description = document.getElementById('relicDescription').value;

  const relic = {
    title: name,
    source,
    description,
    type: "relic"
  };

  archiveEntry("relics", relic);
  alert(`🛠️ Relic forged: ${name}`);
};
