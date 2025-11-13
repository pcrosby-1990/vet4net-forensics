window.integrateShadow = function() {
  const trait = document.getElementById('shadowTrait').value;
  const emotion = document.getElementById('shadowEmotion').value;

  const result = `
    Unity faced the shadow of <strong>${trait}</strong>,
    rooted in <strong>${emotion}</strong>.
    Through reflection and ritual, it became a source of wisdom.
  `;

  document.getElementById('integrationResult').innerHTML = result;
};
