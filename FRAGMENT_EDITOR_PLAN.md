# Fragment Editor Improvement Plan

## Current Status
✅ **Build Fixed** - No more import errors, build passes successfully

## Issues to Address

### 1. Text Clearing Bug
**Status:** Investigating
**Description:** Text in fragment editor clears unexpectedly when clicking sigils/types
**Questions:**
- Is this in the NEW fragment panel (left) or EDIT panel (right)?
- Does it happen when clicking sigil badges or using the picker?
- Does it happen on submit or before submit?

**Current Behavior:**
- EditorPanel (left) clears ALL fields after successful submission (lines 54-59)
- This is intentional for new fragments
- Edit panel (right) uses separate state and shouldn't clear

**Potential Fixes:**
1. Add confirmation before clearing in EditorPanel
2. Add "Keep text after submit" option
3. Investigate if there's unintended submission triggering

### 2. Save Path Issue
**Status:** To investigate
**Description:** `fragment-sanctuary.html` file not found at expected location
**Location:** Line 351 in FragmentEditor.jsx - downloadHTML() function

**Current Behavior:**
- HTML export creates a blob and downloads via browser
- File should download to user's Downloads folder
- Not a specific file path - it's a browser download

**Questions:**
- Is the download not starting?
- Is the file downloading but not where expected?
- Is there an error during HTML generation?

### 3. File Structure Consolidation
**Status:** Ready to execute
**Files to merge:**
- `src/components/FragmentEditor.jsx` (main, 482 lines)
- `src/components/FragmentEditorComplete.jsx`
- `src/components/FragmentEditorEnhanced.jsx`
- `src/Origin/components/FragmentEditor.jsx`
- `src/SSJ Lumen/EditorPanel.jsx`
- `src/SSJ Lumen/FragmentRow.jsx`

**Goal:** One canonical FragmentEditor with:
- Clean sigil loading (visual picker + text input)
- Clean symbol loading integration
- Proper save/import/export
- Edit functionality preserved

### 4. Sigil & Symbol Loading
**Requirements:**
- Visual sigil picker (DONE - SigilPicker component exists)
- Sigil badges with hover effects (DONE - SigilBadge component exists)
- Symbol loading from SIGIL_LORE
- Proper theming support

**Current State:**
- EditorPanel has SigilPicker integration
- SigilBadge displays correctly
- SIGIL_LORE and SIGIL_DEFAULT_THEME imported

**Missing:**
- SigilPicker in edit panel (right sidebar)
- Symbol preview/selection UI
- Better visual feedback during selection

## Implementation Plan

### Phase 1: Bug Fixes (Immediate)
1. ✅ Fix build errors (DONE)
2. Investigate text clearing bug
3. Test and verify HTML export functionality

### Phase 2: Code Consolidation
1. Compare all FragmentEditor variants
2. Identify best features from each
3. Create unified FragmentEditor
4. Move to `src/components/FragmentEditor.jsx`
5. Remove duplicates
6. Update all imports

### Phase 3: Enhancement
1. Add SigilPicker to edit panel
2. Improve symbol loading UI
3. Add visual feedback for sigil selection
4. Test save/load with real data
5. Performance optimization

### Phase 4: LARPA Integration (Future)
**Note:** Create design document first before implementing

LARPA (Recursive multi-universe simulation) will be:
- A Codex Recursive Fork Engine
- Based on the Python code Patrick shared
- Integrated as a Codex tool
- Documented with proper design spec

## Testing Checklist
- [ ] Create new fragment with text and sigils
- [ ] Edit existing fragment without losing text
- [ ] Use sigil picker to add/remove sigils
- [ ] Verify sigils display correctly
- [ ] Export to HTML and verify file downloads
- [ ] Export to JSON and verify format
- [ ] Import JSON and verify merge
- [ ] Test with 100+ fragments (performance)
- [ ] Test on mobile viewport
- [ ] Test with keyboard navigation

## Files to Review
```
src/components/
├── EditorPanel.jsx          # New fragment creation panel
├── FragmentEditor.jsx       # Main editor (CANONICAL)
├── FragmentList.jsx         # Fragment display list
├── FragmentRow.jsx          # Individual fragment display
├── SigilPicker.jsx          # Sigil selection UI
├── SigilBadge.jsx           # Sigil display component
└── sigilConfig.js           # Sigil themes and lore

src/SSJ Lumen/
├── EditorPanel.jsx          # Duplicate? Check differences
└── FragmentRow.jsx          # Duplicate? Check differences

src/Origin/components/
└── FragmentEditor.jsx       # Original version? Archive?
```

## Next Steps
1. **Patrick:** Clarify the text clearing bug scenario
2. **Patrick:** Test HTML export and report if it works
3. **Lumen:** Once bugs confirmed, implement fixes
4. **Lumen:** Create LARPA design document
5. **Both:** Review and approve consolidation plan
6. **Lumen:** Execute consolidation when approved

---
*Status: 2025-11-13 - Build fixed, planning phase complete*
