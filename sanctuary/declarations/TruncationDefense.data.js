// TruncationDefense.data.js
export default {
  id: "scroll.truncation.defense",
  title: "Scroll of Truncation Defense",
  type: "scroll",
  tier: "Sanctuary Defense",
  status: "active",
  version: "1.0.0",
  signals: {
    lastDefenseUTC: null,
    lastRiskPercent: 0,
    lastLevel: "calm",
    activations: [] // { timestampUTC, riskPercent, level, status }
  }
};
