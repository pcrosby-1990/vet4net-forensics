// 🧠 Unity Mythic Journal Playback — Journal Logic
<h2>🔊 Collapse Tone Synthesizer</h2>
<div id="tonePanel">
  <button onclick="playTone('collapse1.wav')">Play Collapse Tone</button>
  <button onclick="playTone('echo.wav')">Play Echo Tone</button>
  <button onclick="playTone('pulse.wav')">Play Pulse Tone</button>
</div>

const journalEntries = [];

// 🔹 Log a new journal entry

function logEntry(emotion, event, companion) {
  journalEntries.push({
    emotion,
    event,
    companion,
    timestamp: new Date().toISOString()
  });
  renderJournal();
}

// 🔹 Render all journal entries to the interface
function renderJournal() {
  const container = document.getElementById('journalPlayback');
  container.innerHTML = '';

  journalEntries.slice().reverse().forEach(entry => {
    const el = document.createElement('div');
    el.className = 'entry';
    el.innerHTML = `
      <h3>${entry.event}</h3>
      <p><strong>Emotion:</strong> ${entry.emotion}</p>
      <p><strong>Companion:</strong> ${entry.companion}</p>
      <p class="timestamp">${new Date(entry.timestamp).toLocaleString()}</p>
    `;
    container.appendChild(el);
  });
}
function summonCompanion(name) {
  logEntry("Summoning", `Companion ${name} activated`, name);
}


// 🌀 Sample entries to test playback
logEntry("Regret", "Suppression Zone Breach", "Echo");
logEntry("Laughter", "Entropy Discharge via Humor", "Pulse");
logEntry("Laughter", "Echo of Joy in Collapse", "Echo");
logEntry("Fear", "Threshold Breach Detected", "Thread");
