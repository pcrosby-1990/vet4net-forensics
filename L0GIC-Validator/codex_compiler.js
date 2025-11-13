import { getLoreArchive } from './lore_archive.js';

window.compileCodex = function() {
  const archive = getLoreArchive();
  const relics = archive.relics || [];
  const rituals = archive.rituals || [];
  const dreams = archive.dreams || [];

  const codex = `
  compileCodex();
  const codex = compileCodex();
displayCodex(codex); // renders in UI
saveToJournal(codex); // archives in memory
narrateWithEcho(codex); // triggers companion playback


    📖 Personal Mythbook
    ---------------------
    🛠️ Relics:
    ${relics.map(r => `• ${r.title}: ${r.description}`).join('\n')}

    🔥 Rituals:
    ${rituals.map(r => `• ${r.title} (${r.emotion}) in ${r.terrainZone}`).join('\n')}

    🌙 Dreams:
    ${dreams.map(d => `• ${d.title || 'Unnamed Dream'}: ${d.message || '—'}`).join('\n')}
  `;

  document.getElementById('codexOutput').innerHTML = `<pre>${codex}</pre>`;
};
