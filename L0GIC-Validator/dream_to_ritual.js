window.convertDream = function() {
  const fragment = document.getElementById('dreamInput').value;
  const ritual = generateRitual(fragment);

  document.getElementById('ritualOutput').innerHTML = `
    <strong>Ritual Generated:</strong><br>
    ${ritual}
  `;
};

function generateRitual(fragment) {
  if (fragment.includes("signal")) return "Trace the glyph in silence, then speak the phrase aloud.";
  if (fragment.includes("hollow")) return "Place a stone in water and name what was lost.";
  if (fragment.includes("flight")) return "Write the name of your fear on paper, then burn it under moonlight.";
  return "Sit in stillness. Let the dream speak through breath.";
}
