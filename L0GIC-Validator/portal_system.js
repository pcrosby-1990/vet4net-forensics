const realms = {
  "Descent Valley": {
    archetypes: ["Pilgrim", "Ancestor"],
    terrain: "Grief, Memory, Depth",
    portals: ["Legacy Grove", "Threshold Ridge"]
  },
  "Wonder Sky": {
    archetypes: ["Creator", "Child"],
    terrain: "Joy, Curiosity, Awe",
    portals: ["Threshold Ridge"]
  },
  "Threshold Ridge": {
    archetypes: ["Phoenix", "Thread"],
    terrain: "Change, Confusion, Identity",
    portals: ["Descent Valley", "Wonder Sky"]
  }
};

export function getAvailablePortals(currentRealm) {
  return realms[currentRealm]?.portals || [];
}

export function travelToRealm(realmName) {
  const realm = realms[realmName];
  if (!realm) {
    console.warn(`❌ Unknown realm: ${realmName}`);
    return null;
  }
  console.log(`🌀 Traveling to ${realmName}...`);
  return realm;
}
