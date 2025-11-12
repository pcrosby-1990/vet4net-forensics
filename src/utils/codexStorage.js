// Unified Codex Storage System
// All fragments, threads, and relationships stored in localStorage cache
// No static imports, no localhost dependency

/**
 * Codex Storage Manager
 * Pure localStorage-based storage for fragments, threads, and relationships
 */
class CodexStorageManager {
  constructor() {
    this.fragments = [];
    this.threads = [];
    this.relationships = [];
    this.loaded = false;
  }

  async initialize() {
    if (this.loaded) return;

    try {
      // Load ONLY from localStorage cache
      const cachedFragments = JSON.parse(localStorage.getItem('codexFragmentsCache') || '[]');
      const cachedThreads = JSON.parse(localStorage.getItem('codexThreadsCache') || '[]');
      const cachedRels = JSON.parse(localStorage.getItem('codexRelationshipsCache') || '[]');

      this.fragments = cachedFragments;
      this.threads = cachedThreads;
      this.relationships = cachedRels;

      // Migrate from old localStorage keys if they exist
      await this.migrateFromLegacyStorage();

      this.loaded = true;
      console.log('🕯️ Codex storage initialized (localStorage only)');
      console.log(`   Fragments: ${this.fragments.length}`);
      console.log(`   Threads: ${this.threads.length}`);
      console.log(`   Relationships: ${this.relationships.length}`);
    } catch (error) {
      console.error('Failed to initialize codex storage:', error);
      this.fragments = [];
      this.threads = [];
      this.relationships = [];
      this.loaded = true;
    }
  }

  async migrateFromLegacyStorage() {
    try {
      // Check for old spiralCodex key
      const oldFragments = JSON.parse(localStorage.getItem('spiralCodex') || '[]');
      const oldThreads = JSON.parse(localStorage.getItem('fragmentThreads') || '[]');
      const oldRels = JSON.parse(localStorage.getItem('fragmentRelationships') || '[]');

      let migrated = 0;

      // Migrate old fragments if cache is empty
      if (this.fragments.length === 0 && oldFragments.length > 0) {
        this.fragments = oldFragments;
        migrated += oldFragments.length;
        localStorage.removeItem('spiralCodex'); // Clean up old key
      }

      // Migrate old threads
      if (this.threads.length === 0 && oldThreads.length > 0) {
        this.threads = oldThreads;
        migrated += oldThreads.length;
        localStorage.removeItem('fragmentThreads');
      }

      // Migrate old relationships
      if (this.relationships.length === 0 && oldRels.length > 0) {
        this.relationships = oldRels;
        migrated += oldRels.length;
        localStorage.removeItem('fragmentRelationships');
      }

      if (migrated > 0) {
        console.log(`🔄 Migrated ${migrated} items from legacy storage`);
        this.saveToCache();
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  // Fragment operations
  getAllFragments() {
    return [...this.fragments];
  }

  getFragment(id) {
    return this.fragments.find(f => f.id === id);
  }

  addFragment(fragment) {
    if (!fragment.id) {
      fragment.id = `frag-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
    this.fragments.unshift(fragment);
    this.saveToCache(); // Auto-save to cache
    return fragment;
  }

  updateFragment(id, updates) {
    const index = this.fragments.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    this.fragments[index] = { ...this.fragments[index], ...updates };
    this.saveToCache(); // Auto-save to cache
    return this.fragments[index];
  }

  deleteFragment(id) {
    const index = this.fragments.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    this.fragments.splice(index, 1);
    this.saveToCache(); // Auto-save to cache
    return true;
  }

  // Thread operations
  getAllThreads() {
    return [...this.threads];
  }

  getThread(id) {
    return this.threads.find(t => t.id === id);
  }

  addThread(thread) {
    this.threads.push(thread);
    this.saveToCache();
    return thread;
  }

  updateThread(id, updates) {
    const index = this.threads.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.threads[index] = { ...this.threads[index], ...updates };
    this.saveToCache();
    return this.threads[index];
  }

  deleteThread(id) {
    const index = this.threads.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.threads.splice(index, 1);
    this.saveToCache();
    return true;
  }

  // Relationship operations
  getAllRelationships() {
    return [...this.relationships];
  }

  getRelationship(id) {
    return this.relationships.find(r => r.id === id);
  }

  addRelationship(relationship) {
    this.relationships.push(relationship);
    this.saveToCache();
    return relationship;
  }

  deleteRelationship(id) {
    const index = this.relationships.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    this.relationships.splice(index, 1);
    this.saveToCache();
    return true;
  }

  // Cache storage (localStorage for session persistence)
  saveToCache() {
    try {
      localStorage.setItem('codexFragmentsCache', JSON.stringify(this.fragments));
      localStorage.setItem('codexThreadsCache', JSON.stringify(this.threads));
      localStorage.setItem('codexRelationshipsCache', JSON.stringify(this.relationships));
      console.log('💾 Saved to cache');
    } catch (error) {
      console.error('Failed to save to cache:', error);
    }
  }

  // Export for saving to codex files
  exportToCodex() {
    return {
      fragments: {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        fragments: this.fragments
      },
      threads: {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        threads: this.threads
      },
      relationships: {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        relationships: this.relationships
      }
    };
  }

  // Generate JSON files for download
  generateCodexFiles() {
    const data = this.exportToCodex();
    
    return [
      {
        filename: 'fragments.codex.json',
        content: JSON.stringify(data.fragments, null, 2)
      },
      {
        filename: 'threads.codex.json',
        content: JSON.stringify(data.threads, null, 2)
      },
      {
        filename: 'relationships.codex.json',
        content: JSON.stringify(data.relationships, null, 2)
      }
    ];
  }

  // Download codex files
  downloadCodexFiles() {
    const files = this.generateCodexFiles();
    
    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    console.log('📥 Downloaded codex files (save to sanctuary/fragments/)');
  }
}

// Singleton instance
export const codexStorage = new CodexStorageManager();

// Initialize on import
codexStorage.initialize();

// Expose to window for console access
if (typeof window !== 'undefined') {
  window.codexStorage = codexStorage;
  
  console.log('🕯️ Codex Storage System loaded (localStorage-only mode)');
  console.log('   - window.codexStorage - Access storage');
  console.log('   - codexStorage.downloadCodexFiles() - Download JSON files');
  console.log('   - Fragments auto-save to localStorage on every change');
}

export default codexStorage;
