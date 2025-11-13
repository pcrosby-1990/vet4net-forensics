window.composeGlyph = function() {
  const p1 = document.getElementById('phrase1').value;
  const p2 = document.getElementById('phrase2').value;

  const glyph = `
    ⟡ ${p1} + ${p2} ⟡
    → Symbolic fusion: "${p1.slice(0, 3)}-${p2.slice(-3)}"
    → Meaning: A dream language fragment born of ${p1} and ${p2}
  `;

  document.getElementById('glyphOutput').innerHTML = `<pre>${glyph}</pre>`;
};
