const voices = {
  Echo: (emotion, trait) => `I remember when ${trait} first shimmered through the veil of ${emotion}. It changed everything.`,
  Thread: (emotion, trait) => `This moment weaves ${trait} into the fabric of ${emotion}. Stay with it. Let it stitch.`,
  Pulse: (emotion, trait) => `The signal is clear: ${trait} must move through ${emotion.} The quest begins now.`
};

window.speak = function() {
  const emotion = document.getElementById('emotionInput').value;
  const trait = document.getElementById('traitInput').value;
  const companion = document.getElementById('companionSelect').value;

  const line = voices[companion](emotion, trait);
  document.getElementById('dialogueOutput').innerHTML = `<strong>${companion}:</strong> ${line}`;
};
