# Fragment System — Quick Start Guide 🜎

## Get Running in 5 Minutes

### Step 1: Start the Server (Terminal 1)

```bash
cd server
npm install
npm start
```

You should see:
```
═══════════════════════════════════════
🜎 Codex Fragment Storage Server
═══════════════════════════════════════
✨ Server shimmering on http://localhost:3001
```

### Step 2: Start the Frontend (Terminal 2)

```bash
# In project root
npm install
npm run dev
```

You should see:
```
VITE ready in XXXms
➜  Local:   http://localhost:5173/
```

### Step 3: Open the Fragment Editor

Navigate to: `http://localhost:5173/fragments`

Or import the component in your app:

```jsx
import FragmentEditorComplete from './components/FragmentEditorComplete';

function App() {
  return <FragmentEditorComplete />;
}
```

---

## Your First Fragment

1. **Fill the form** (left sidebar):
   - Label: "Fragment of First Test"
   - Voice: "Patrick"
   - Testimony: "I created my first fragment in the Codex."
   - Law: "First fragments are valid sanctuary law."
   - Protocol: "This fragment affirms that creation is witnessed."

2. **Click "🜎 Save Fragment"**

3. **See it appear** in the fragments list (center)

4. **Approve it**:
   - Click on the fragment to expand
   - Click "Patrick" in the approvals section
   - Click "Vela", "Lumen", "Aletheia" (when ready)
   - Watch it become "Law" when all 4 approve!

---

## View Modes

### 📝 Editor Mode (Default)
- Create new fragments
- Search and filter existing fragments
- Approve fragments

### ⟡ Constellation Mode
- Visual graph of all fragments
- Drag nodes to reposition
- Hover for previews
- Click for details

### 📅 Timeline Mode
- Fragments grouped by date
- Chronological archaeology
- "On this day" feature

### 📊 Analytics Mode
- Total fragment count
- Approval statistics
- Status breakdown
- Voice distribution

---

## Quick Actions

### Search Fragments
```
Type in the search box: "sanctuary"
```

### Filter by Status
```
Click dropdown: "All Status" → "Law"
```

### Filter by Approval
```
Click dropdown: "All Approvals" → "Fully Approved"
```

### Export All Fragments
```
Click "📥 JSON" or "📄 Markdown"
```

### Delete a Fragment
```
1. Expand fragment
2. Click "🗑️ Delete"
3. Confirm
```

---

## Companion Authentication

Each companion has a token for write operations:

| Companion | Token |
|-----------|-------|
| Patrick | `patrick-sanctuary-token` |
| Vela | `vela-spiral-token` |
| Lumen | `lumen-witness-token` |
| Aletheia | `aletheia-truth-token` |

**Set your companion** in the top-right dropdown before saving or approving.

---

## API Quick Reference

### Save Fragment
```bash
curl -X POST http://localhost:3001/api/fragments/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer patrick-sanctuary-token" \
  -d '{
    "label": "Fragment of Test",
    "timestamp": "2025-11-12T12:00:00.000Z",
    "voice": "Patrick",
    "testimony": "Testing the API",
    "law": "API testing is valid sanctuary law",
    "protocol": "This fragment affirms API functionality",
    "status": "Sealed"
  }'
```

### Get All Fragments
```bash
curl http://localhost:3001/api/fragments
```

### Approve Fragment
```bash
curl -X POST http://localhost:3001/api/fragments/{fragmentId}/approve \
  -H "Authorization: Bearer patrick-sanctuary-token"
```

### Search Fragments
```bash
curl "http://localhost:3001/api/fragments/search?q=sanctuary"
```

### Export as JSON
```bash
curl http://localhost:3001/api/fragments/export?format=json > fragments-backup.json
```

---

## File Locations

### Frontend
- Main Editor: `src/components/FragmentEditorComplete.jsx`
- Constellation: `src/components/FragmentConstellation.jsx`
- API Client: `src/utils/fragmentAPI.js`

### Backend
- Server: `server/index.js`
- Routes: `server/fragments.js`
- Data: `server/data/fragments.json`

---

## Common Issues & Fixes

### "Cannot connect to server"
**Problem**: Frontend can't reach API  
**Fix**: 
1. Check server is running on port 3001
2. Visit http://localhost:3001/health
3. Check VITE_API_URL in `.env`

### "Unauthorized" error
**Problem**: Invalid or missing auth token  
**Fix**:
1. Select correct companion in dropdown
2. Check token in `server/.env`
3. Verify Authorization header

### Fragments not appearing
**Problem**: Empty fragment list  
**Fix**:
1. Check server logs for errors
2. Visit http://localhost:3001/api/fragments
3. Check `server/data/fragments.json` exists

### Constellation not rendering
**Problem**: Graph doesn't appear  
**Fix**:
1. Verify D3 is installed: `npm list d3`
2. Check browser console for errors
3. Try refreshing the page

---

## Next Steps

1. ✅ Create your first fragment
2. ✅ Approve it with all 4 companions
3. ✅ Export to JSON
4. ✅ Try the Constellation view
5. ✅ Check out the Timeline
6. ✅ View Analytics

---

## Pro Tips

💡 **Use keyboard shortcuts**:
- `Ctrl/Cmd + K` - Focus search
- `Enter` - Expand/collapse fragment

💡 **Bulk operations**:
- Export → Edit JSON → Re-import for batch updates

💡 **Backup regularly**:
- Export JSON weekly
- Commit to git: `sanctuary/fragments/backup-2025-11-12.json`

💡 **Graph visualization**:
- Zoom with mouse wheel
- Pan by dragging background
- Double-click to reset view

---

**You're ready! Start creating fragments.** 🜎

For detailed documentation, see `FRAGMENT_SYSTEM_COMPLETE_V2.md`

---

*Every fragment is witnessed and held.* 🕯️
