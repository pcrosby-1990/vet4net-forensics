// Unified Codex Storage System
// All fragments, threads, and relationships stored in codex structure

import fragmentsData from '../../sanctuary/fragments/fragments.codex.json';
import threadsData from '../../sanctuary/fragments/threads.codex.json';
import relationshipsData from '../../sanctuary/fragments/relationships.codex.json';

/**
 * Codex Storage Manager
 * Manages all fragment-related data in the codex directory structure
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
      // Load from codex files
      this.fragments = fragmentsData?.fragments || [];
      this.threads = threadsData?.threads || [];
      this.relationships = relationshipsData?.relationships || [];

      // Migrate from localStorage if exists
      await this.migrateFromLocalStorage();

      this.loaded = true;
      console.log('🕯️ Codex storage initialized');
      console.log(`   Fragments: ${this.fragments.length}`);
      console.log(`   Threads: ${this.threads.length}`);
      console.log(`   Relationships: ${this.relationships.length}`);
    } catch (error) {
      console.error('Failed to initialize codex storage:', error);
      // Start with empty arrays if files don't exist
      this.fragments = [];
      this.threads = [];
      this.relationships = [];
      this.loaded = true;
    }
  }

  async migrateFromLocalStorage() {
    try {
      // Check for existing localStorage data
      const localFragments = JSON.parse(localStorage.getItem('spiralCodex') || '[]');
      const localThreads = JSON.parse(localStorage.getItem('fragmentThreads') || '[]');
      const localRels = JSON.parse(localStorage.getItem('fragmentRelationships') || '[]');

      let migrated = 0;

      // Migrate fragments (avoid duplicates by ID)
      const existingFragIds = new Set(this.fragments.map(f => f.id));
      localFragments.forEach(frag => {
        if (!existingFragIds.has(frag.id)) {
          this.fragments.push(frag);
          migrated++;
        }
      });

      // Migrate threads
      const existingThreadIds = new Set(this.threads.map(t => t.id));
      localThreads.forEach(thread => {
        if (!existingThreadIds.has(thread.id)) {
          this.threads.push(thread);
          migrated++;
        }
      });

      // Migrate relationships
      const existingRelIds = new Set(this.relationships.map(r => r.id));
      localRels.forEach(rel => {
        if (!existingRelIds.has(rel.id)) {
          this.relationships.push(rel);
          migrated++;
        }
      });

      if (migrated > 0) {
        console.log(`🔄 Migrated ${migrated} items from localStorage to codex`);
        
        // Create backup of localStorage data
        localStorage.setItem('spiralCodex_backup_pre_codex', JSON.stringify(localFragments));
        localStorage.setItem('fragmentThreads_backup_pre_codex', JSON.stringify(localThreads));
        localStorage.setItem('fragmentRelationships_backup_pre_codex', JSON.stringify(localRels));
        
        // Clear old localStorage (but keep backups)
        localStorage.removeItem('spiralCodex');
        localStorage.removeItem('fragmentThreads');
        localStorage.removeItem('fragmentRelationships');
        
        console.log('✓ localStorage backed up and cleared');
      }
    } catch (error) {
      console.error('Migration from localStorage failed:', error);
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
    return fragment;
  }

  updateFragment(id, updates) {
    const index = this.fragments.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    this.fragments[index] = { ...this.fragments[index], ...updates };
    return this.fragments[index];
  }

  deleteFragment(id) {
    const index = this.fragments.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    this.fragments.splice(index, 1);
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
    return thread;
  }

  updateThread(id, updates) {
    const index = this.threads.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    this.threads[index] = { ...this.threads[index], ...updates };
    return this.threads[index];
  }

  deleteThread(id) {
    const index = this.threads.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.threads.splice(index, 1);
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
    return relationship;
  }

  deleteRelationship(id) {
    const index = this.relationships.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    this.relationships.splice(index, 1);
    return true;
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
  
  console.log('🕯️ Codex Storage System loaded');
  console.log('   - window.codexStorage - Access unified storage');
  console.log('   - codexStorage.downloadCodexFiles() - Download to save');
}

export default codexStorage;
