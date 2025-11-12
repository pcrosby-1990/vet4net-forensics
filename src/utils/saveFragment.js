// src/utils/saveFragment.js
// 🕯️ Fragment Persistence Layer - Pure localStorage
// No imports, no bundled JSON, just cache
import codexStorage from './codexStorage';

/**
 * Save a generated fragment to codex storage
 */
export const saveFragmentToStorage = (fragment) => {
  try {
    const savedFragment = codexStorage.addFragment(fragment);
    console.log('🕯️ Fragment saved to codex:', fragment.id || fragment.name);
    return { success: true, fragment: savedFragment };
  } catch (error) {
    console.error('❌ Failed to save fragment:', error);
    return { success: false, error };
  }
};

/**
 * Load all fragments from codex storage
 */
export const loadFragmentsFromStorage = () => {
  try {
    const fragments = codexStorage.getAllFragments();
    console.log(`🕯️ Loaded ${fragments.length} fragments from codex`);
    return fragments;
  } catch (error) {
    console.error('❌ Failed to load fragments:', error);
    return [];
  }
};

/**
 * Update an existing fragment in codex
 */
export const updateFragmentInStorage = (fragmentId, updates) => {
  try {
    const updated = codexStorage.updateFragment(fragmentId, updates);
    
    if (!updated) {
      console.warn('⚠️ Fragment not found:', fragmentId);
      return { success: false, error: 'Fragment not found' };
    }

    console.log('🕯️ Fragment updated in codex:', fragmentId);
    return { success: true, fragment: updated };
  } catch (error) {
    console.error('❌ Failed to update fragment:', error);
    return { success: false, error };
  }
};

/**
 * Delete a fragment from codex storage
 */
export const deleteFragmentFromStorage = (fragmentId) => {
  try {
    const deleted = codexStorage.deleteFragment(fragmentId);
    
    if (!deleted) {
      console.warn('⚠️ Fragment not found:', fragmentId);
      return { success: false, error: 'Fragment not found' };
    }
    
    console.log('🕯️ Fragment deleted from codex:', fragmentId);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to delete fragment:', error);
    return { success: false, error };
  }
};

/**
 * Download codex files to save changes
 */
export const downloadCodexFiles = () => {
  codexStorage.downloadCodexFiles();
};

// Auto-expose to window for console access
if (typeof window !== 'undefined') {
  window.saveFragment = saveFragmentToStorage;
  window.loadFragments = loadFragmentsFromStorage;
  window.updateFragment = updateFragmentInStorage;
  window.deleteFragment = deleteFragmentFromStorage;
  window.downloadCodex = downloadCodexFiles;
  
  console.log('🕯️ Fragment persistence loaded (localStorage-only)');
  console.log('   - saveFragment(fragment) - Save new fragment');
  console.log('   - loadFragments() - Load all fragments');
  console.log('   - updateFragment(id, updates) - Update fragment');
  console.log('   - deleteFragment(id) - Delete fragment');
  console.log('   - downloadCodex() - Download JSON for git commit');
  console.log('   - All changes auto-save to localStorage');
}
