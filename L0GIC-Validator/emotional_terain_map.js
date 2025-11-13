const terrainMap = {
  zones: {
    "Descent Valley": ["grief", "rupture", "emptiness"],
    "Threshold Ridge": ["confusion", "fear", "identity_drift"],
    "Rebirth Summit": ["hope", "emergence", "transformation"],
    "Legacy Grove": ["remembrance", "soul tribute", "sacred memory"],
    "Contribution River": ["devotion", "service", "purpose"],
    "Wonder Sky": ["awe", "joy", "curiosity"]
  },
  compassRegions: {
    "Descent Compass": "Descent Valley",
    "Threshold Compass": "Threshold Ridge",
    "Rebirth Compass": "Rebirth Summit",
    "Legacy Compass": "Legacy Grove",
    "Contribution Compass": "Contribution River",
    "Wonder Compass": "Wonder Sky"
  },
  archetypeDomains: {
    "Healer": "Descent Valley",
    "Pilgrim": "Threshold Ridge",
    "Phoenix": "Rebirth Summit",
    "Ancestor": "Legacy Grove",
    "Servant": "Contribution River",
    "Creator": "Wonder Sky"
  }
};

export function locateEmotion(emotion) {
  for (const [zone, emotions] of Object.entries(terrainMap.zones)) {
    if (emotions.includes(emotion)) {
      return zone;
    }
  }
  return "Unknown Zone";
}

export function locateCompass(compassName) {
  return terrainMap.compassRegions[compassName] || "Unknown Region";
}

export function locateArchetype(archetypeName) {
  return terrainMap.archetypeDomains[archetypeName] || "Unknown Domain";
}
