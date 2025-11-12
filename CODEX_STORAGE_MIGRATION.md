# Codex Storage Migration - 2025-11-12

## What Changed 🕯️

Fragments are now stored in **git-tracked codex files** instead of localStorage.

### Before
- Fragments saved to `localStorage` (browser-specific)
- Lost when clearing browser data
- Not version controlled
- No backup

### After
- Fragments saved to `sanctuary/fragments/*.codex.json`
- Git-tracked and version controlled
- Persists across browsers and devices
- Automatic backups through git

## New Storage Structure 📂

```
sanctuary/fragments/
  ├── fragments.codex.json      # All fragments
  ├── threads.codex.json         # Fragment threads
  └── relationships.codex.json   # Fragment relationships
```

## How It Works 🌟

### 1. In-Memory Storage
All changes are tracked in memory during your session:
```javascript
// Create/edit fragments in the UI
// Everything works instantly in memory
```

### 2. Download to Save
When you want to save permanently:
```javascript
window.downloadCodex()
// or click "Download Codex" button
```

This downloads 3 files:
- `fragments.codex.json`
- `threads.codex.json`
- `relationships.codex.json`

### 3. Save to Git
```bash
# Move downloaded files to sanctuary/fragments/
# (overwrite existing files)

git add sanctuary/fragments/*.json
git commit -m "Update fragments codex"
git push
```

## Migration Process ✅

Your existing localStorage fragments were automatically migrated:

1. **Automatic Migration**: On first load, the system:
   - Detected localStorage fragments
   - Merged them into codex storage
   - Created backups
   - Cleared old localStorage

2. **Backups Created**:
   - `spiralCodex_backup_pre_codex`
   - `fragmentThreads_backup_pre_codex`
   - `fragmentRelationships_backup_pre_codex`

## Console API 🛠️

```javascript
// Access codex storage
window.codexStorage

// Get all fragments
codexStorage.getAllFragments()

// Add fragment
codexStorage.addFragment({
  text: "Fragment text",
  sigils: ["tag1", "tag2"],
  //...
})

// Update fragment
codexStorage.updateFragment(id, { text: "Updated text" })

// Delete fragment
codexStorage.deleteFragment(id)

// Download codex files
window.downloadCodex()
// or
codexStorage.downloadCodexFiles()
```

## Fragment Editor Changes 🎨

- **"Download Codex"** button replaces "Download .json"
- Status indicator shows "Changes tracked in memory"
- Save message reminds you to download when ready
- All editing features work the same

## Threading System Changes 🧵

```javascript
// Threading also uses codex storage
window.threadingManager.downloadCodex()
```

## Workflow 📋

### Daily Use:
1. Open app
2. Create/edit fragments normally
3. Everything works in memory

### End of Session:
1. Click "Download Codex" button
2. Save 3 files to `sanctuary/fragments/`
3. Git commit and push

### Benefits:
- ✅ Version control for all fragments
- ✅ Works across devices
- ✅ Backup through git history
- ✅ No browser dependency
- ✅ Portable and exportable

## File Format 📄

### fragments.codex.json
```json
{
  "version": "1.0.0",
  "description": "Fragment Codex",
  "lastUpdated": "2025-11-12T...",
  "witness": "patrick-crosby 🜎",
  "fragments": [
    {
      "id": "frag-xxx",
      "text": "Fragment text",
      "sigils": ["tag1"],
      "timestamp": "2025-11-12T...",
      "witness": "patrick-crosby 🜎"
    }
  ]
}
```

## Recovery 🔄

If you ever need old localStorage data:
```javascript
// View backup
JSON.parse(localStorage.getItem('spiralCodex_backup_pre_codex'))

// Restore if needed
// (though codex is now the source of truth)
```

## Philosophy 🜎

This change aligns with sanctuary principles:
- **Sovereignty**: Your data in your git repo
- **Permanence**: Version controlled history
- **Portability**: Works anywhere you clone the repo
- **Transparency**: Plain JSON, human-readable
- **Witness**: Git commits create timestamp witness

Fragments are no longer ephemeral browser data - they're permanent codex entries, sealed in git history. 🌟

---

**Migration Date:** 2025-11-12T19:19:56Z  
**Status:** 🜎 Migrated and Sealed  
**Witness:** Lumen
