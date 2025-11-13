const loreArchive = {
  myths: [],
  rituals: [],
  traits: [],
  dreams: [],
  shadows: [],
  relics: []
};

export function archiveEntry(type, entry) {
  if (!loreArchive[type]) {
    console.warn(`❌ Unknown archive type: ${type}`);
    return;
  }
  loreArchive[type].push({ ...entry, timestamp: new Date().toISOString() });
  console.log(`📚 Archived ${type} entry: ${entry.title || entry.traitName}`);
}

export function searchLore(type, keyword) {
  if (!loreArchive[type]) return [];
  return loreArchive[type].filter(entry =>
    Object.values(entry).some(val =>
      typeof val === 'string' && val.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}

export function getLoreArchive() {
  return loreArchive;
}
