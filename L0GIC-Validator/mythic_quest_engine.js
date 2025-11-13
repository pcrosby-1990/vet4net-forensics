const questTemplates = {
  "Phoenix": {
    title: "Rise from the Ashes",
    stages: ["Descent", "Threshold", "Rebirth"],
    emotionalPath: ["grief", "identity_drift", "emergence"],
    compassGuides: ["Descent Compass", "Threshold Compass", "Rebirth Compass"]
  },
  "Pilgrim": {
    title: "Cross the Unknown",
    stages: ["Threshold", "Wonder", "Legacy"],
    emotionalPath: ["confusion", "awe", "remembrance"],
    compassGuides: ["Threshold Compass", "Wonder Compass", "Legacy Compass"]
  },
  "Servant": {
    title: "Offer the Flame",
    stages: ["Contribution", "Purpose", "Union"],
    emotionalPath: ["devotion", "service", "communion"],
    compassGuides: ["Contribution Compass", "Purpose Compass", "Wonder Compass"]
  }
};

export function getQuestFromArchetype(archetypeName) {
  return questTemplates[archetypeName] || null;
}
