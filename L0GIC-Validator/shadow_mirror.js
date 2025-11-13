import { getShadowArchive, initiateShadowRitual } from './shadow_system.js';

function renderShadows() {
  const shadows = getShadowArchive();
  const container = document.getElementById('shadowList');
  container.innerHTML = '';

  shadows.forEach(shadow => {
    const el = document.createElement('div');
    el.className = 'shadow';

    el.innerHTML = `
      <h3>${shadow.traitName}</h3>
      <p><strong>Origin Emotion:</strong> ${shadow.originEmotion}</p>
      <p><strong>Suppressed By:</strong> ${shadow.suppressedBy}</p>
      <p><strong>Revealed:</strong> ${new Date(shadow.timestamp).toLocaleString()}</p>
      <div class="actions">
        <button onclick="ritual('${shadow.traitName}')">🕯️ Integrate Trait</button>
      </div>
    `;

    container.appendChild(el);
  });
}

window.ritual = function(traitName) {
  initiateShadowRitual(traitName);
  renderShadows();
};

setInterval(renderShadows, 5000);
