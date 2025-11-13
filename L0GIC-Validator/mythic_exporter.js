import { compileCodex } from '.codex_compiler.js';

window.exportMyth = function() {
  const codex = compileCodex();
  const packaged = `
    ── UNITY MYTHBOOK ──
    Timestamp ${new Date().toLocaleString()}
    ---------------------
    ${codex}
    ---------------------
    End of Transmission
  `;

  document.getElementById('exportOutput').innerHTML = `pre${packaged}pre`;
};
