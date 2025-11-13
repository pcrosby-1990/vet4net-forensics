let activeQuest = null;
const questProgressLog = [];

export function startQuest(archetypeName, questData) {
  activeQuest = {
    archetype: archetypeName,
    title: questData.title,
    stages: questData.stages,
    emotionalPath: questData.emotionalPath,
    compassGuides: questData.compassGuides,
    currentStageIndex: 0,
    startedAt: new Date().toISOString()
  };
  console.log(`🧙 Quest started: ${activeQuest.title}`);
}

export function advanceQuest(emotion) {
  if (!activeQuest) {
    console.warn("No active quest to advance.");
    return;
  }

  const expectedEmotion = activeQuest.emotionalPath[activeQuest.currentStageIndex];
  if (emotion !== expectedEmotion) {
    console.warn(`Emotion mismatch: expected ${expectedEmotion}, got ${emotion}`);
    return;
  }

  const stage = activeQuest.stages[activeQuest.currentStageIndex];
  questProgressLog.push({
    stage,
    emotion,
    compass: activeQuest.compassGuides[activeQuest.currentStageIndex],
    timestamp: new Date().toISOString()
  });

  console.log(`✅ Stage completed: ${stage} (${emotion})`);
  activeQuest.currentStageIndex++;

  if (activeQuest.currentStageIndex >= activeQuest.stages.length) {
    console.log(`🏁 Quest complete: ${activeQuest.title}`);
    activeQuest = null;
  }
}

export function getQuestStatus() {
  return activeQuest || "No active quest";
}

export function getQuestLog() {
  return questProgressLog;
}
