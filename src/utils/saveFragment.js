// src/utils/saveFragment.js
// 🕯️ Fragment Persistence Layer

/**
 * Save a generated fragment to localStorage AND to the in-memory registry
 * This creates shimmer persistence across page reloads
 */
export const saveFragmentToStorage = (fragment) => {
  try {
    // Get existing fragments from localStorage
    const existingFragments = JSON.parse(
      localStorage.getItem('resonanceFragments') || '[]'
    );

    // Add new fragment to the beginning (most recent first)
    const updated = [fragment, ...existingFragments];

    // Save back to localStorage
    localStorage.setItem('resonanceFragments', JSON.stringify(updated));

    console.log('🕯️ Fragment saved to localStorage:', fragment.id || fragment.name);
    return { success: true, fragment };
  } catch (error) {
    console.error('❌ Failed to save fragment:', error);
    return { success: false, error };
  }
};

/**
 * Load all fragments from localStorage
 */
export const loadFragmentsFromStorage = () => {
  try {
    const fragments = JSON.parse(
      localStorage.getItem('resonanceFragments') || '[]'
    );
    console.log(`🕯️ Loaded ${fragments.length} fragments from localStorage`);
    return fragments;
  } catch (error) {
    console.error('❌ Failed to load fragments:', error);
    return [];
  }
};

/**
 * Update an existing fragment
 */
export const updateFragmentInStorage = (fragmentId, updates) => {
  try {
    const fragments = loadFragmentsFromStorage();
    const index = fragments.findIndex(f => (f.id || f.name) === fragmentId);
    
    if (index === -1) {
      console.warn('⚠️ Fragment not found:', fragmentId);
      return { success: false, error: 'Fragment not found' };
    }

    fragments[index] = { ...fragments[index], ...updates };
    localStorage.setItem('resonanceFragments', JSON.stringify(fragments));
    
    console.log('🕯️ Fragment updated:', fragmentId);
    return { success: true, fragment: fragments[index] };
  } catch (error) {
    console.error('❌ Failed to update fragment:', error);
    return { success: false, error };
  }
};

/**
 * Delete a fragment from storage
 */
export const deleteFragmentFromStorage = (fragmentId) => {
  try {
    const fragments = loadFragmentsFromStorage();
    const filtered = fragments.filter(f => (f.id || f.name) !== fragmentId);
    
    localStorage.setItem('resonanceFragments', JSON.stringify(filtered));
    console.log('🕯️ Fragment deleted:', fragmentId);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to delete fragment:', error);
    return { success: false, error };
  }
};

// Auto-expose to window for console access
if (typeof window !== 'undefined') {
  window.saveFragment = saveFragmentToStorage;
  window.loadFragments = loadFragmentsFromStorage;
  window.updateFragment = updateFragmentInStorage;
  window.deleteFragment = deleteFragmentFromStorage;
  
  console.log('🕯️ Lumen: Fragment persistence loaded');
  console.log('   - saveFragment(fragment) - Save new fragment');
  console.log('   - loadFragments() - Load all fragments');
  console.log('   - updateFragment(id, updates) - Update fragment');
  console.log('   - deleteFragment(id) - Delete fragment');
}
