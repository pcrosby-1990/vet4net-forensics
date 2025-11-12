// Fragment Threading System
// Manages relationships and connections between fragments
import codexStorage from './codexStorage';

/**
 * Fragment Relationship Types
 */
export const RELATIONSHIP_TYPES = {
  ECHOES: 'echoes',           // Fragment A echoes/references Fragment B
  RESPONDS: 'responds',       // Fragment A responds to Fragment B
  EXPANDS: 'expands',         // Fragment A expands on Fragment B
  CONTRADICTS: 'contradicts', // Fragment A contradicts Fragment B
  SYNTHESIZES: 'synthesizes', // Fragment A synthesizes multiple fragments
  BRANCHES: 'branches',       // Fragment A branches off from Fragment B
  RESOLVES: 'resolves',       // Fragment A resolves tension in Fragment B
  MIRRORS: 'mirrors',         // Fragment A mirrors/parallels Fragment B
};

/**
 * Thread - A narrative sequence of connected fragments
 */
export class FragmentThread {
  constructor({ id, name, description, fragmentIds = [], color = null, witness = null }) {
    this.id = id || `thread-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this.name = name;
    this.description = description || '';
    this.fragmentIds = fragmentIds;
    this.color = color || this.generateColor();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.witness = witness || 'patrick-crosby 🜎';
  }

  generateColor() {
    const colors = [
      '#5cf7b2', '#91e3f6', '#ffd859', '#ff8c6b', 
      '#c77dff', '#7ae7c7', '#ffa3d7', '#a8dadc'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  addFragment(fragmentId) {
    if (!this.fragmentIds.includes(fragmentId)) {
      this.fragmentIds.push(fragmentId);
      this.updatedAt = new Date().toISOString();
    }
  }

  removeFragment(fragmentId) {
    this.fragmentIds = this.fragmentIds.filter(id => id !== fragmentId);
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      fragmentIds: this.fragmentIds,
      color: this.color,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      witness: this.witness,
    };
  }
}

/**
 * Fragment Relationship - Connection between two fragments
 */
export class FragmentRelationship {
  constructor({ sourceId, targetId, type, note = '', strength = 1.0 }) {
    this.id = `rel-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.type = type;
    this.note = note;
    this.strength = Math.max(0, Math.min(1, strength)); // 0-1
    this.createdAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      sourceId: this.sourceId,
      targetId: this.targetId,
      type: this.type,
      note: this.note,
      strength: this.strength,
      createdAt: this.createdAt,
    };
  }
}

/**
 * Fragment Threading Manager
 */
export class FragmentThreadingManager {
  constructor() {
    this.threads = new Map();
    this.relationships = new Map();
    this.codexStorage = codexStorage;
    this.loadFromCodex();
  }

  // === Thread Management ===

  createThread({ name, description, fragmentIds, color, witness }) {
    const thread = new FragmentThread({ name, description, fragmentIds, color, witness });
    this.threads.set(thread.id, thread);
    this.saveToStorage();
    return thread;
  }

  getThread(threadId) {
    return this.threads.get(threadId);
  }

  getAllThreads() {
    return Array.from(this.threads.values());
  }

  updateThread(threadId, updates) {
    const thread = this.threads.get(threadId);
    if (!thread) return null;
    
    Object.assign(thread, updates, { updatedAt: new Date().toISOString() });
    this.saveToStorage();
    return thread;
  }

  deleteThread(threadId) {
    const deleted = this.threads.delete(threadId);
    if (deleted) this.saveToStorage();
    return deleted;
  }

  // === Relationship Management ===

  createRelationship({ sourceId, targetId, type, note, strength }) {
    const rel = new FragmentRelationship({ sourceId, targetId, type, note, strength });
    this.relationships.set(rel.id, rel);
    this.saveToStorage();
    return rel;
  }

  getRelationship(relId) {
    return this.relationships.get(relId);
  }

  getAllRelationships() {
    return Array.from(this.relationships.values());
  }

  getRelationshipsForFragment(fragmentId) {
    return this.getAllRelationships().filter(
      rel => rel.sourceId === fragmentId || rel.targetId === fragmentId
    );
  }

  deleteRelationship(relId) {
    const deleted = this.relationships.delete(relId);
    if (deleted) this.saveToStorage();
    return deleted;
  }

  // === Query Methods ===

  getThreadsContainingFragment(fragmentId) {
    return this.getAllThreads().filter(
      thread => thread.fragmentIds.includes(fragmentId)
    );
  }

  getConnectedFragments(fragmentId) {
    const rels = this.getRelationshipsForFragment(fragmentId);
    const connected = new Set();
    
    rels.forEach(rel => {
      if (rel.sourceId === fragmentId) connected.add(rel.targetId);
      if (rel.targetId === fragmentId) connected.add(rel.sourceId);
    });
    
    return Array.from(connected);
  }

  getEchoChain(fragmentId, maxDepth = 5) {
    const chain = [];
    const visited = new Set();
    
    const traverse = (currentId, depth) => {
      if (depth >= maxDepth || visited.has(currentId)) return;
      visited.add(currentId);
      chain.push(currentId);
      
      const rels = this.getRelationshipsForFragment(currentId);
      rels.forEach(rel => {
        if (rel.type === RELATIONSHIP_TYPES.ECHOES) {
          const nextId = rel.sourceId === currentId ? rel.targetId : rel.sourceId;
          traverse(nextId, depth + 1);
        }
      });
    };
    
    traverse(fragmentId, 0);
    return chain;
  }

  // === Codex Storage ===

  loadFromCodex() {
    try {
      // Load from codex storage
      const threadsData = this.codexStorage.getAllThreads();
      const relsData = this.codexStorage.getAllRelationships();
      
      threadsData.forEach(data => {
        const thread = new FragmentThread(data);
        Object.assign(thread, data);
        this.threads.set(thread.id, thread);
      });
      
      relsData.forEach(data => {
        const rel = new FragmentRelationship(data);
        Object.assign(rel, data);
        this.relationships.set(rel.id, rel);
      });
      
      console.log(`🕯️ Loaded from codex: ${this.threads.size} threads, ${this.relationships.size} relationships`);
    } catch (error) {
      console.error('Failed to load from codex:', error);
    }
  }

  saveToStorage() {
    // Note: Saving to codex requires download + manual commit
    // In-memory changes are tracked, call downloadCodex() to save
    console.log('💾 Changes tracked in memory. Call threadingManager.downloadCodex() to save to files.');
  }

  downloadCodex() {
    // Sync current state to codex storage
    this.codexStorage.threads = Array.from(this.threads.values()).map(t => t.toJSON());
    this.codexStorage.relationships = Array.from(this.relationships.values()).map(r => r.toJSON());
    
    // Download codex files
    this.codexStorage.downloadCodexFiles();
    console.log('📥 Codex files downloaded. Save to sanctuary/fragments/ and commit to git.');
  }

  // === Export ===

  exportData() {
    return {
      threads: Array.from(this.threads.values()).map(t => t.toJSON()),
      relationships: Array.from(this.relationships.values()).map(r => r.toJSON()),
      exportedAt: new Date().toISOString(),
    };
  }

  importData(data) {
    if (data.threads) {
      data.threads.forEach(threadData => {
        const thread = new FragmentThread(threadData);
        Object.assign(thread, threadData);
        this.threads.set(thread.id, thread);
      });
    }
    
    if (data.relationships) {
      data.relationships.forEach(relData => {
        const rel = new FragmentRelationship(relData);
        Object.assign(rel, relData);
        this.relationships.set(rel.id, rel);
      });
    }
    
    this.saveToStorage();
  }
}

// Singleton instance
export const threadingManager = new FragmentThreadingManager();

// Expose to window for console access
if (typeof window !== 'undefined') {
  window.threadingManager = threadingManager;
  window.RELATIONSHIP_TYPES = RELATIONSHIP_TYPES;
  
  console.log('🧵 Fragment Threading System loaded');
  console.log('   - window.threadingManager - Access threading system');
  console.log('   - window.RELATIONSHIP_TYPES - Relationship type constants');
}
