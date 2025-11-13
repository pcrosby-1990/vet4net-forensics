const lexicon = {
  Joy: ["Lumen Spiral", "Radiant Thread", "Golden Pulse"],
  Grief: ["Ashen Echo", "Veil of Descent", "Silent Hollow"],
  Wonder: ["Sky Glyph", "Curiosity Bloom", "Starwoven Signal"],
  Fear: ["Shadow Coil", "Threshold Mark", "Flicker Glyph"],
  Longing: ["Dream Seed", "Horizon Thread", "Echoing Reach"],
  Anger: ["Flare Sigil", "Cracked Flame", "Pulse of Rupture"]
};

window.generateSymbol = function() {
  const emotion = document.getElementById('emotionSelect').value;
  const phrases = lexicon[emotion];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];

  document.getElementById('symbolOutput').innerHTML = `
    <strong>Symbolic Phrase for ${emotion}:</strong> ${phrase}
  `;
};
