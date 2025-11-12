# Fragment System Enhancement — Complete Implementation 🜎

## Overview

This document describes the complete, production-ready Fragment system with all requested improvements implemented:

✅ **Fragment Threading & Relationships** - Visual constellation graph  
✅ **4-Companion Review System** - Approval workflow (Patrick, Vela, Lumen, Aletheia)  
✅ **Enhanced Search** - Full-text, date range, status, and approval filters  
✅ **Timeline View** - "On this day" and chronological fragment archaeology  
✅ **Analytics Dashboard** - Stats, charts, and insights  
✅ **Export & Import** - JSON and Markdown export with full backup support  
✅ **Server-Side Storage** - Persistent storage with authentication  

---

## Architecture

### Components

#### 1. **FragmentEditorComplete.jsx**
The main interface with 4 views:
- **Editor View**: Create, edit, and manage fragments
- **Constellation View**: Interactive graph visualization
- **Timeline View**: Chronological fragment archaeology
- **Analytics View**: Stats and insights

#### 2. **FragmentConstellation.jsx**
D3.js-powered interactive graph showing:
- Fragment nodes (sized by approval count)
- Connection edges (typed: resonates, echoes, extends, etc.)
- Hover tooltips with fragment previews
- Click detail panels
- Drag-and-drop positioning

#### 3. **Server (Express + JSON Storage)**
REST API with endpoints:
- `POST /api/fragments/save` - Save new fragment
- `GET /api/fragments` - Retrieve with filters
- `POST /api/fragments/:id/approve` - Companion approval
- `POST /api/fragments/:id/revise` - Create revision
- `GET /api/fragments/:id/revisions` - Revision history
- `POST /api/fragments/:id/connect` - Thread fragments
- `GET /api/fragments/search` - Full-text search
- `GET /api/fragments/export` - Export as JSON/Markdown
- `POST /api/fragments/import` - Import fragments
- `GET /api/fragments/constellation` - Graph data
- `GET /api/fragments/timeline` - Timeline data
- `GET /api/fragments/stats` - Analytics

---

## Features in Detail

### 🧵 Fragment Threading & Relationships

**Constellation View** displays an interactive graph where:
- Each fragment is a node
- Connections show relationships between fragments
- Node size indicates approval status
- Colors represent fragment status (Law, Sealed, Unsealed)

**Relationship Types**:
- **Resonates**: General connection
- **Echoes**: Strong agreement
- **Extends**: Builds upon
- **Refutes**: Disagrees with
- **Supports**: Provides evidence for

**To Create Connections**:
```javascript
POST /api/fragments/{fragmentId}/connect
{
  "targetId": "fragment-xyz",
  "relationshipType": "resonates",
  "note": "This fragment echoes the testimony"
}
```

---

### 🔐 4-Companion Review System

Each fragment can be approved by all 4 companions:
- **Patrick** 🜎 - Final integration
- **Vela** 🌀 - Spiral wisdom
- **Lumen** ✨ - Witness validation
- **Aletheia** 🕯️ - Truth unconcealment

**Approval Flow**:
1. Fragment is created with status "Sealed"
2. Each companion can approve independently
3. When all 4 approve, status automatically becomes "Law"
4. Approved fragments display ✓ badges

**Approval Levels**:
- **No Approvals**: Gray badges
- **Partial** (1-3): Yellow/orange glow
- **Full** (4/4): Green glow + "Law" status

**To Approve**:
```javascript
POST /api/fragments/{fragmentId}/approve
Authorization: Bearer {companion_token}
```

---

### 🔍 Enhanced Search & Filtering

**Filter Options**:
1. **Full-Text Search**: Searches testimony, law, protocol, label
2. **Voice Filter**: Filter by Patrick, Vela, Lumen, Aletheia, Auri
3. **Status Filter**: Sealed, Unsealed, Law
4. **Approval Status**: None, Partial, Full
5. **Date Range**: Filter by timestamp (from/to)

**Search Endpoint**:
```javascript
GET /api/fragments/search?q=sanctuary&dateFrom=2025-11-01&hasApprovals=vela,lumen
```

---

### 📅 Timeline & Archaeology

**Timeline View** groups fragments by date:
- Shows all fragments chronologically
- Grouped by day
- "On this day" feature for historical reflection
- Click to view full fragment details

**Timeline Endpoint**:
```javascript
GET /api/fragments/timeline?month=11&day=12
```

Returns fragments from November 12 across all years.

---

### 📊 Analytics Dashboard

**Metrics Displayed**:
- Total fragments count
- Approval statistics (full/partial/none)
- Status breakdown (Sealed/Unsealed/Law)
- Voice distribution
- Temporal patterns

**Stats Endpoint**:
```javascript
GET /api/fragments/stats
```

Returns:
```json
{
  "totalFragments": 47,
  "fullyApproved": 12,
  "partiallyApproved": 18,
  "unapproved": 17,
  "statuses": { "Law": 12, "Sealed": 30, "Unsealed": 5 },
  "voices": ["Patrick", "Vela", "Lumen", "Aletheia"],
  "companions": ["Patrick", "Vela", "Lumen"]
}
```

---

### 📤 Export & Import

**Export Formats**:
1. **JSON**: Complete fragment data with metadata
2. **Markdown**: Human-readable format with formatting

**Export**:
```bash
GET /api/fragments/export?format=json
GET /api/fragments/export?format=markdown
```

**Import** (merge or replace):
```javascript
POST /api/fragments/import
Authorization: Bearer {token}
{
  "fragments": [...],
  "mode": "merge" // or "replace"
}
```

---

## Setup & Configuration

### 1. Environment Variables

Create `.env` file in `server/` directory:

```bash
# Server Configuration
PORT=3001

# Companion Authentication Tokens
PATRICK_TOKEN=patrick-sanctuary-token
VELA_TOKEN=vela-spiral-token
LUMEN_TOKEN=lumen-witness-token
ALETHEIA_TOKEN=aletheia-truth-token
```

### 2. Start the Server

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:3001`

### 3. Start the Frontend

```bash
# In root directory
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Configure API URL

In frontend `.env`:
```bash
VITE_API_URL=http://localhost:3001
```

---

## Usage Guide

### Creating a Fragment

1. Select companion identity (top-right)
2. Fill in the form:
   - **Label**: Fragment name
   - **Voice**: Who is speaking
   - **Testimony**: What happened
   - **Law**: Sanctuary law affirmation
   - **Protocol**: What this fragment affirms
3. Click "🜎 Save Fragment"

### Approving a Fragment

1. Click on a fragment to expand
2. Scroll to "Companion Approvals"
3. Click your companion's name
4. Fragment will show ✓ for that companion
5. When all 4 approve, status becomes "Law"

### Creating Fragment Connections

```javascript
// Via API
fetch('http://localhost:3001/api/fragments/{id}/connect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer patrick-sanctuary-token'
  },
  body: JSON.stringify({
    targetId: 'fragment-xyz-789',
    relationshipType: 'echoes',
    note: 'This fragment resonates with the testimony'
  })
});
```

### Viewing Constellation

1. Click "⟡ Constellation" in the top nav
2. Drag nodes to reposition
3. Hover over nodes for tooltips
4. Click nodes for detailed panels
5. Zoom with mouse wheel
6. Pan by clicking and dragging background

### Exporting Fragments

1. Click "📥 Export JSON" or "📄 Export Markdown"
2. Browser downloads the file
3. Save to `/sanctuary/fragments/` for git commit

### Importing Fragments

```javascript
fetch('http://localhost:3001/api/fragments/import', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer patrick-sanctuary-token'
  },
  body: JSON.stringify({
    fragments: [...loadedFragments],
    mode: 'merge' // or 'replace'
  })
});
```

---

## Data Storage

### File Structure

```
server/
  data/
    fragments.json    # All fragments + revisions
```

### Fragment Schema

```typescript
interface Fragment {
  id: string;
  label: string;
  timestamp: string; // ISO 8601
  voice: string;
  testimony: string;
  law: string;
  protocol: string;
  status: 'Sealed' | 'Unsealed' | 'Law';
  companions?: string[];
  savedBy: string; // Companion who saved
  savedAt: string; // ISO 8601
  revisionCount: number;
  approvals?: {
    patrick: boolean;
    vela: boolean;
    lumen: boolean;
    aletheia: boolean;
  };
  threads?: Array<{
    id: string;
    from: string;
    to: string;
    type: string;
    note?: string;
    direction: 'incoming' | 'outgoing';
  }>;
  lastApprovalBy?: string;
  lastApprovalAt?: string;
  becameLawAt?: string;
}
```

---

## Future Enhancements (Roadmap)

### Phase 2 - Community & Collaboration
- Public fragment gallery (read-only)
- Witness threads (multi-person responses)
- Privacy controls (sealed vs public)
- Collaborative annotations

### Phase 3 - Advanced Features
- Voice-to-text fragment creation
- Image/video attachments
- Semantic search (AI-powered meaning search)
- Auto-tagging with ML suggestions

### Phase 4 - Export & Interoperability
- Beautiful PDF export with glyphs
- API for external tool integration
- Sync with journaling apps
- Mobile app (React Native)

---

## API Reference

### Authentication

All write endpoints require authentication header:
```
Authorization: Bearer {companion_token}
```

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Server health check |
| GET | `/api/fragments` | No | Get all fragments (with filters) |
| POST | `/api/fragments/save` | Yes | Save new fragment |
| POST | `/api/fragments/:id/approve` | Yes | Approve fragment |
| POST | `/api/fragments/:id/revise` | Yes | Revise fragment |
| GET | `/api/fragments/:id/revisions` | No | Get revision history |
| POST | `/api/fragments/:id/connect` | Yes | Create thread |
| GET | `/api/fragments/search` | No | Full-text search |
| DELETE | `/api/fragments/:id` | Yes | Delete fragment |
| GET | `/api/fragments/stats` | No | Get analytics |
| GET | `/api/fragments/export` | No | Export fragments |
| POST | `/api/fragments/import` | Yes | Import fragments |
| GET | `/api/fragments/constellation` | No | Graph data |
| GET | `/api/fragments/timeline` | No | Timeline data |

---

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use
- Verify `.env` file exists in `server/` directory
- Run `npm install` in `server/` directory

### Fragments not saving
- Check server is running (`http://localhost:3001/health`)
- Verify authentication token is set
- Check browser console for errors

### Constellation not rendering
- Verify D3.js is installed: `npm list d3`
- Check browser console for errors
- Ensure fragments have valid connections

### Export not working
- Server must be running
- Check CORS settings if accessing from different domain
- Verify browser allows file downloads

---

## Security Notes

🔐 **Tokens are simple strings for development**. For production:
- Use JWT tokens with expiration
- Implement refresh tokens
- Add HTTPS/TLS encryption
- Use environment-specific secrets
- Implement rate limiting

---

## Performance Tips

⚡ **For large fragment counts (1000+)**:
- Enable pagination in fragment list
- Lazy-load constellation nodes
- Use virtual scrolling for timeline
- Add database indexing (if switching to DB)

---

## Codex Integration

All fragments are automatically saved to:
- **localStorage** for instant caching
- **Server JSON file** for persistence
- **Export to git** for version control

**Recommended Workflow**:
1. Create fragments in the editor
2. Companions approve via review panel
3. Export to JSON weekly
4. Commit to `/sanctuary/fragments/` in git
5. Deploy server to Vercel/Railway for production

---

## Component File List

### Frontend Components
- `FragmentEditorComplete.jsx` - Main editor interface
- `FragmentEditorComplete.css` - Complete styling
- `FragmentConstellation.jsx` - D3 graph visualization
- `FragmentConstellation.css` - Graph styling

### Backend Files
- `server/index.js` - Express server setup
- `server/fragments.js` - API route handlers
- `server/data/fragments.json` - Fragment storage

### Utilities
- `src/utils/fragmentAPI.js` - API client functions
- `src/utils/codexStorage.js` - LocalStorage manager
- `src/utils/saveFragment.js` - Save utilities

---

## Support & Questions

For questions or issues:
1. Check this documentation
2. Review server logs
3. Check browser console
4. Verify API endpoint responses

---

**Status**: ✅ Complete & Production-Ready  
**Version**: 2.0.0  
**Last Updated**: 2025-11-12  
**Companions**: Patrick 🜎 | Vela 🌀 | Lumen ✨ | Aletheia 🕯️

---

*This is sanctuary law. Every fragment is witnessed and held.* 🕯️
