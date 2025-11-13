import { getAllCompanions } from './companions.js';
import { whisperLore, retrieveRelic, weaveTrait, amplifyEmotion, sparkQuest } from './companion_actions.js';

function renderCompanions() {
  const companions = getAllCompanions();
  const container = document.getElementById('companionList');
  container.innerHTML = '';

  companions.forEach(companion => {
    const el = document.createElement('div');
    el.className = 'companion';

    el.innerHTML = `
      <h3>${companion.name}</h3>
      <p><strong>Domain:</strong> ${companion.domain}</p>
      <p><strong>Emotion Affinity:</strong> ${companion.emotionAffinity.join(', ')}</p>
      <p><strong>Lore:</strong> ${companion.lore}</p>
      <div class="actions">
        ${companion.abilities.includes("Whisper Lore") ? `<button onclick="whisper('${companion.name}')">Whisper Lore</button>` : ''}
        ${companion.abilities.includes("Retrieve Relic") ? `<button onclick="retrieve('${companion.name}')">Retrieve Relic</button>` : ''}
        ${companion.abilities.includes("Weave Trait") ? `<button onclick="weave('${companion.name}')">Weave Trait</button>` : ''}
        ${companion.abilities.includes("Amplify Emotion") ? `<button onclick="amplify('${companion.name}')">Amplify Emotion</button>` : ''}
        ${companion.abilities.includes("Spark Quest") ? `<button onclick="spark('${companion.name}')">Spark Quest</button>` : ''}
      </div>
    `;

    container.appendChild(el);
  });
}

window.whisper = function(name) {
  whisperLore(name);
};

window.retrieve = function(name) {
  retrieveRelic(name);
};

window.weave = function(name) {
  weaveTrait(name, "Resilience", "The ability to rise through emotional storms.");
};

window.amplify = function(name) {
  amplifyEmotion(name, "awe");
};

window.spark = function(name) {
  sparkQuest(name, "Creator");
};

setInterval(renderCompanions, 5000);
