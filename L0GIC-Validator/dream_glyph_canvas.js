const canvas = document.getElementById('glyphCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!drawing) return;
  ctx.fillStyle = '#f0f';
  ctx.beginPath();
  ctx.arc(e.offsetX, e.offsetY, 2, 0, Math.PI * 2);
  ctx.fill();
}

window.decodeGlyph = function() {
  const meaning = [
    "A portal to forgotten memory",
    "Symbol of longing and release",
    "Thread between worlds",
    "Echo of ancestral wisdom",
    "Seed of transformation"
  ];
  const result = meaning[Math.floor(Math.random() * meaning.length)];
  document.getElementById('glyphMeaning').innerHTML = `<p><strong>Decoded:</strong> ${result}</p>`;
};
