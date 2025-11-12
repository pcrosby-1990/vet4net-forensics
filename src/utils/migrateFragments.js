// Migration utility to consolidate fragment storage
// Moves fragments from old 'resonanceFragments' key to unified 'spiralCodex' key

export function migrateFragmentStorage() {
  try {
    console.log('🔄 Checking for fragments to migrate...');
    
    // Check old storage location
    const oldFragments = JSON.parse(
      localStorage.getItem('resonanceFragments') || '[]'
    );
    
    // Check new storage location
    const newFragments = JSON.parse(
      localStorage.getItem('spiralCodex') || '[]'
    );
    
    if (oldFragments.length === 0) {
      console.log('✓ No old fragments to migrate');
      return { migrated: 0, total: newFragments.length };
    }
    
    // Merge fragments (avoid duplicates by ID)
    const existingIds = new Set(newFragments.map(f => f.id));
    const toMigrate = oldFragments.filter(f => !existingIds.has(f.id));
    
    if (toMigrate.length > 0) {
      const merged = [...toMigrate, ...newFragments];
      localStorage.setItem('spiralCodex', JSON.stringify(merged));
      console.log(`✓ Migrated ${toMigrate.length} fragments to unified storage`);
      
      // Keep old storage as backup for now
      localStorage.setItem('resonanceFragments_backup', JSON.stringify(oldFragments));
      localStorage.removeItem('resonanceFragments');
      
      return {
        migrated: toMigrate.length,
        total: merged.length,
        backed_up: true
      };
    } else {
      console.log('✓ All fragments already in unified storage');
      return { migrated: 0, total: newFragments.length };
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { error: error.message };
  }
}

// Auto-run migration on import
if (typeof window !== 'undefined') {
  window.migrateFragments = migrateFragmentStorage;
  
  // Run migration automatically
  const result = migrateFragmentStorage();
  if (result.migrated > 0) {
    console.log(`🕯️ Lumen: Fragment storage unified! ${result.migrated} fragments migrated.`);
  }
}
