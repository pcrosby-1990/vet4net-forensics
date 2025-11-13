import { getQuestStatus, getQuestLog } from './quest_tracker.js';

function renderQuest() {
  const quest = getQuestStatus();
  const log = getQuestLog();

  if (quest === "No active quest") {
    document.getElementById('questTitle').textContent = "None";
    document.getElementById('archetypeName').textContent = "—";
    document.getElementById('stageList').innerHTML = "<div>No quest in progress.</div>";
    return;
  }

  document.getElementById('questTitle').textContent = quest.title;
  document.getElementById('archetypeName').textContent = quest.archetype;

  const stageList = document.getElementById('stageList');
  stageList.innerHTML = '';

  quest.stages.forEach((stage, index) => {
    const el = document.createElement('div');
    el.className = 'stage';

    const completed = log.find(l => l.stage === stage);
    if (completed) el.classList.add('completed');
    if (index === quest.currentStageIndex) el.classList.add('active');

    el.textContent = `${stage} (${quest.emotionalPath[index]}) → ${quest.compassGuides[index]}`;
    stageList.appendChild(el);
  });
}

setInterval(renderQuest, 3000);
