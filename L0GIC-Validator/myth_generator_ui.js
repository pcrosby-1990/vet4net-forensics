import { generateMyth } from './myth_generator.js';
import { recordRelic } from './emotional_codex.js';
import { whisperLore } from './companion_actions.js';

let currentMyth = "";

window.generateMyth = function() {
  currentMyth = generateMyth();
  const box = document.getElementById('mythBox');
  box.innerHTML = `<p>${currentMyth}</p>`;
  box.classList.add('revealed');
};

window.exportToCodex = function() {
  if (!currentMyth) return;
  recordRelic("Myth Fragment", currentMyth, "Myth Generator");
  alert("✅ Myth exported to Codex.");
};

window.shareWithCompanion = function() {
  if (!currentMyth) return;
  whisperLore("Echo");
  alert("📩 Myth shared with Echo.");
};
