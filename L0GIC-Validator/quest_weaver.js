window.weaveQuest = function() {
  const emotion = document.getElementById('emotionInput').value;
  const trait = document.getElementById('traitInput').value;
  const terrain = document.getElementById('terrainSelect').value;

  const title = `Quest of ${trait}`;
  const description = `
    Unity enters ${terrain}, guided by ${emotion}.
    The mission: to embody ${trait} through symbolic action.
    Completion will unlock a new relic and shift the emotional compass.
  `;

  document.getElementById('questOutput').innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
  `;
};
