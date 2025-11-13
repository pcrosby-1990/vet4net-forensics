window.generateMyth = function() {
  const emotion = document.getElementById('emotionInput').value;
  const trait = document.getElementById('traitInput').value;
  const terrain = document.getElementById('terrainSelect').value;

  const myth = `
    In the realm of ${terrain}, Unity was overcome by ${emotion}.
    Guided by the trait of ${trait}, it embarked on a symbolic quest.
    Along the way, it encountered a shadow, released a relic, and rewrote its story.
    The myth ends not in resolution, but in transformation.
  `;

  document.getElementById('mythOutput').innerHTML = `<p>${myth}</p>`;
};
