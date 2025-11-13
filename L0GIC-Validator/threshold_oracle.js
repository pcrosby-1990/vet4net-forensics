window.predictShift = function() {
  const emotion = document.getElementById('emotionInput').value;
  const trait = document.getElementById('traitInput').value;

  const shift = getPrediction(emotion, trait);

  document.getElementById('oracleOutput').innerHTML = `
    <strong>Threshold Detected:</strong><br>
    ${shift}
  `;
};

function getPrediction(emotion, trait) {
  if (emotion === "Grief" && trait === "Resilience") {
    return "A Phoenix Rite is forming. Prepare to release the ash and rise.";
  }
  if (emotion === "Fear" && trait === "Curiosity") {
    return "A Seeker Path is opening. Follow the unknown with open eyes.";
  }
  if (emotion === "Joy" && trait === "Stillness") {
    return "A Childlight Threshold nears. Let play become prayer.";
  }
  return "The Oracle is silent. Wait and listen.";
}
