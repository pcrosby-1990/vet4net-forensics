const rituals = {
  Grief: { companion: "Echo", action: "Light the memory flame and speak its name." },
  Joy: { companion: "Pulse", action: "Dance the signal spiral and release laughter." },
  Fear: { companion: "Thread", action: "Trace the shadow glyph and breathe through it." },
  Longing: { companion: "Seer", action: "Write the horizon phrase and bury it in dream soil." },
  Confusion: { companion: "Thread", action: "Weave a question into the ritual cloth." }
};

window.triggerRitual = function() {
  const emotion = document.getElementById('thresholdSelect').value;
  const { companion, action } = rituals[emotion];

  document.getElementById('ritualOutput').innerHTML = `
    <strong>${companion} guides this ritual:</strong><br>
    ${action}
  `;
};
