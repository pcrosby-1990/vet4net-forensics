## 🜎 Fragment Management System - Quick Start

### Start the Server
```bash
cd server
node index.js
```

### Configure Tokens
1. Open the app
2. Click "🔐 Tokens"
3. Enter tokens for Patrick, Vela, Lumen, Aletheia
4. Click "Save Tokens"

### Create a Fragment
```javascript
// Use the UI or console:
await fragmentAPI.save({
  label: "My Fragment",
  timestamp: new Date().toISOString(),
  voice: "Patrick",
  testimony: "This is my testimony...",
  law: "This is the law...",
  protocol: "This is the protocol...",
  status: "Sealed",
  companions: ["Vela", "Lumen"]
}, 'patrick')
```

### Approve a Fragment
1. Select fragment in UI
2. Go to "Approval" tab
3. Click "Approve" for each companion
4. Fragment becomes Law when all 4 approve 🜎

### Thread Fragments
1. Select fragment
2. Go to "Threading" tab
3. Click "+ New Thread"
4. Select target + relationship type
5. Fragment

### Export All Fragments
```bash
# In UI: Click "📥 Export JSON" or "📥 Export MD"

# Or via console:
fragmentAPI.export(fragments, 'markdown')
```

### API Health Check
```bash
curl http://localhost:3001/health
```

That's it! Your fragments are now stored server-side with full approval workflow and threading support! 🌀✨
