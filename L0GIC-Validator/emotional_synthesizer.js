const blends = {
  "Joy+Grief": "Bittersweet Radiance",
  "Wonder+Fear": "Sacred Awe",
  "Longing+Anger": "Feral Devotion",
  "Grief+Wonder": "Melancholic Revelation",
  "Joy+Wonder": "Elation Spiral",
  "Fear+Joy": "Exhilaration",
  "Grief+Fear": "Shadowed Stillness"
};

window.synthesize = function() {
  const e1 = document.getElementById('emotion1').value;
  const e2 = document.getElementById('emotion2').value;
  const key = `${e1}+${e2}`;
  const reverseKey = `${e2}+${e1}`;
  const result = blends[key] || blends[reverseKey] || "Unstable Fusion";

  document.getElementById('synthResult').innerHTML = `<strong>Symbolic State:</strong> ${result}`;
};
