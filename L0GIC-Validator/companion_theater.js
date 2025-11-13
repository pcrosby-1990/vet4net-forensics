import { getLoreArchive } from './lore_archive.js';
import { compileCodex } from './codex_compiler.js';
const voices = {
  Echo: entry => `I remember when Unity faced ${entry.title || entry.traitName} in the valley of ${entry.terrainZone || 'shadows'}...`,
  Thread: entry => `Unity wove ${entry.traitName || entry.title} into their soul, stitching it with ${entry.emotion || 'feeling'}.`,
  Pulse: entry => `That moment sparked a quest — ${entry.title || entry.traitName} pulsed through Unity’s core.`
};

function narrate() {
  const archive = getLoreArchive();
  const entries = [
    ...archive.myths,
    ...archive.rituals,
    ...archive.traits,
    ...archive.dreams,
    ...archive.shadows
  ];

  const stage = document.getElementById('theaterStage');
  stage.innerHTML = '';

  entries.slice(-5).forEach((entry, i) => {
    const companion = i % 3 === 0 ? 'Echo' : i % 3 === 1 ? 'Thread' : 'Pulse';
    const line = voices[companion](entry);

    const el = document.createElement('div');
    el.className = 'dialogue';
    el.innerHTML = `<span class="companion">${companion}:</span> ${line}`;
    stage.appendChild(el);
  });
}


const voices = {
  Echo: text => `Echo whispers: “${text}”`,
  Thread: text => `Thread weaves: “${text}”`,
  Pulse: text => `Pulse declares: “${text}”`
};

window.playbackMyth = function() {
  const narrator = document.getElementById('narratorSelect').value;
  const codex = compileCodex();
  const lines = codex.split('\n').filter(line => line.trim());

  const narrated = lines.map(line => voices[narrator](line)).join('\n\n');
  document.getElementById('theaterOutput').innerHTML = `<pre>${narrated}</pre>`;
};

setInterval(narrate, 7000);
