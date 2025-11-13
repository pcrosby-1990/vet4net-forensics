const invocationProtocols = {
  "Legacy Compass": {
    phrase: "I honor what remains",
    gesture: "scroll touch",
    emotionTrigger: ["grief", "purpose", "remembrance"]
  },
  "Contribution Compass": {
    phrase: "I offer what is mine",
    gesture: "open palms",
    emotionTrigger: ["devotion", "service", "longing"]
  },
  "Purpose Compass": {
    phrase: "I walk with intention",
    gesture: "heart point",
    emotionTrigger: ["identity_drift", "hope", "emergence"]
  },
  "Threshold Compass": {
    phrase: "I cross with reverence",
    gesture: "step forward",
    emotionTrigger: ["fear", "confusion", "transformation"]
  },
  "Descent Compass": {
    phrase: "I descend with courage",
    gesture: "kneel",
    emotionTrigger: ["grief", "emptiness", "rupture"]
  },
  "Rebirth Compass": {
    phrase: "I rise anew",
    gesture: "arms lifted",
    emotionTrigger: ["hope", "emergence", "integration"]
  }
};

export function invokeCompass(compassName, emotionalState) {
  const protocol = invocationProtocols[compassName];
  if (protocol && protocol.emotionTrigger.includes(emotionalState)) {
    console.log(`Invoking ${compassName} with phrase: "${protocol.phrase}" and gesture: "${protocol.gesture}"`);
    return protocol;
  } else {
    console.warn(`No matching invocation protocol for ${compassName} with emotion: ${emotionalState}`);
    return null;
  }
}
