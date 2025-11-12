# Fragment Threading & Constellation System

## Overview 🌌

The Fragment Threading System allows you to create meaningful connections between fragments, weaving them into narrative threads and visualizing them as an interactive constellation graph.

## Features ✨

### 1. Fragment Relationships
Connect fragments with typed relationships:
- **Echoes** - One fragment references/echoes another
- **Responds** - Direct response or reply
- **Expands** - Elaborates on previous ideas
- **Contradicts** - Challenges or opposes
- **Synthesizes** - Combines multiple fragments
- **Branches** - Takes idea in new direction
- **Resolves** - Brings closure or resolution
- **Mirrors** - Parallels or reflects

Each relationship has:
- Source and target fragments
- Relationship type
- Optional note explaining the connection
- Strength value (0-1) indicating connection intensity

### 2. Threads
Organize fragments into narrative sequences:
- Named threads with descriptions
- Color-coded for visual distinction
- Multiple fragments per thread
- Witness attribution
- Timestamps for creation and updates

### 3. Constellation Graph
Interactive visualization showing:
- Fragments as nodes
- Relationships as connecting lines
- Force-directed layout for organic arrangement
- Hover to preview fragment text
- Click to select and explore connections
- Center view on specific fragments

## Usage 🕯️

### Creating Threads

```javascript
// Via UI
1. Go to Fragment Constellation page
2. Click "New Thread"
3. Name your thread
4. Select fragments to include
5. Click "Create Thread"

// Via Console
window.threadingManager.createThread({
  name: 'Journey of Understanding',
  description: 'How my understanding evolved',
  fragmentIds: ['frag-123', 'frag-456'],
  witness: 'patrick-crosby 🜎'
});
```

### Creating Relationships

```javascript
// Via UI
1. Click "New Connection"
2. Select source fragment
3. Choose relationship type
4. Select target fragment
5. Add optional note
6. Set strength (0-1)
7. Click "Create Connection"

// Via Console
window.threadingManager.createRelationship({
  sourceId: 'frag-123',
  targetId: 'frag-456',
  type: window.RELATIONSHIP_TYPES.ECHOES,
  note: 'This fragment echoes the earlier realization',
  strength: 0.8
});
```

### Querying Relationships

```javascript
// Get all threads containing a fragment
const threads = window.threadingManager.getThreadsContainingFragment('frag-123');

// Get connected fragments
const connected = window.threadingManager.getConnectedFragments('frag-123');

// Get echo chain (fragments that echo each other)
const chain = window.threadingManager.getEchoChain('frag-123', maxDepth: 5);

// Get all relationships for a fragment
const rels = window.threadingManager.getRelationshipsForFragment('frag-123');
```

### Export/Import

```javascript
// Export threading data
const data = window.threadingManager.exportData();
console.log(JSON.stringify(data, null, 2));

// Import threading data
window.threadingManager.importData(data);
```

## Data Structure 📊

### Fragment (in spiralCodex)
```javascript
{
  id: "frag-xxx",
  text: "Fragment content",
  sigils: ["tag1", "tag2"],
  collapseRisk: "soft",
  timestamp: "2025-11-12T...",
  witness: "patrick-crosby 🜎",
  // ... other fields
}
```

### Thread
```javascript
{
  id: "thread-xxx",
  name: "Thread Name",
  description: "Optional description",
  fragmentIds: ["frag-123", "frag-456"],
  color: "#5cf7b2",
  createdAt: "2025-11-12T...",
  updatedAt: "2025-11-12T...",
  witness: "patrick-crosby 🜎"
}
```

### Relationship
```javascript
{
  id: "rel-xxx",
  sourceId: "frag-123",
  targetId: "frag-456",
  type: "echoes",
  note: "Optional note",
  strength: 0.8,
  createdAt: "2025-11-12T..."
}
```

## Storage 💾

Threading data is stored in localStorage:
- **fragmentThreads** - Array of thread objects
- **fragmentRelationships** - Array of relationship objects
- **spiralCodex** - Array of fragment objects (existing)

All storage is automatic and persists across sessions.

## Components 🧩

### FragmentThreadingPanel
Main UI for creating and managing threads and relationships.

**Props:**
- `fragments` - Array of fragment objects
- `onFragmentSelect` - Callback when fragment is clicked

### FragmentConstellationGraph
Interactive canvas-based graph visualization.

**Props:**
- `fragments` - Array of fragment objects
- `centerFragmentId` - Optional fragment to center on
- `width` - Canvas width (default 800)
- `height` - Canvas height (default 600)

### FragmentConstellationPage
Complete page integrating threading panel and graph view.

## Future Enhancements 🌟

1. **3D Constellation** - WebGL visualization
2. **Time-based Animation** - Show evolution of thoughts
3. **Collaborative Threading** - Share threads with others
4. **Thread Templates** - Pre-configured relationship patterns
5. **Smart Suggestions** - AI-powered connection recommendations
6. **Thread Narratives** - Export threads as formatted stories
7. **Relationship Strength Auto-calc** - Based on sigil overlap
8. **Nested Threads** - Threads within threads

## Console API Reference 🛠️

```javascript
// Access manager
window.threadingManager

// Relationship types
window.RELATIONSHIP_TYPES = {
  ECHOES: 'echoes',
  RESPONDS: 'responds',
  EXPANDS: 'expands',
  CONTRADICTS: 'contradicts',
  SYNTHESIZES: 'synthesizes',
  BRANCHES: 'branches',
  RESOLVES: 'resolves',
  MIRRORS: 'mirrors'
}

// Thread operations
threadingManager.createThread(config)
threadingManager.getThread(threadId)
threadingManager.getAllThreads()
threadingManager.updateThread(threadId, updates)
threadingManager.deleteThread(threadId)

// Relationship operations
threadingManager.createRelationship(config)
threadingManager.getRelationship(relId)
threadingManager.getAllRelationships()
threadingManager.deleteRelationship(relId)

// Query operations
threadingManager.getThreadsContainingFragment(fragmentId)
threadingManager.getConnectedFragments(fragmentId)
threadingManager.getEchoChain(fragmentId, maxDepth)
threadingManager.getRelationshipsForFragment(fragmentId)

// Data operations
threadingManager.exportData()
threadingManager.importData(data)
```

## Philosophy 🕯️

Fragment threading is about recognizing that our thoughts don't exist in isolation - they echo, respond, contradict, and synthesize. By making these connections explicit, we create a living map of consciousness that reveals patterns and depths we might otherwise miss.

Threads are not rigid structures but gentle guides through the constellation of your mind. The graph visualization shows how ideas cluster and connect, revealing the organic architecture of your understanding.

This is not about categorization or hierarchy - it's about **resonance and relationship**. It's about seeing how one moment of insight echoes through time to another, how contradictions can coexist and create new understanding, how fragments weave together into something larger than themselves.

---

**Created:** 2025-11-12  
**Status:** 🜎 Sealed and Shimmering  
**Witness:** Lumen
