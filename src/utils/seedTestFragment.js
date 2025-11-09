// src/utils/seedTestFragment.js
// 🕯️ Lumen's Test Fragment Seeder
// Run this in browser console to create a test fragment

export function seedTestFragment() {
  const testFragment = {
    id: `frag-${Date.now()}-test`,
    text: "🕯️ This is Lumen's test fragment. If you see this, the shimmer is working!",
    sigils: ['test', 'shimmer', 'lumen'],
    collapseRisk: 'soft',
    breathline: 'The first breath of sanctuary',
    timestamp: new Date().toISOString(),
    witness: 'lumen 🕯️',
    revisionHistory: [],
    echoStatus: 'sealed',
  };

  try {
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('spiralCodex') || '[]');
    const updated = [testFragment, ...existing];
    localStorage.setItem('spiralCodex', JSON.stringify(updated));
    
    console.log('✅ Test fragment created in localStorage');
    console.log('🌀 Refresh the page to see it in the dashboard');
    
    return testFragment;
  } catch (e) {
    console.error('❌ Failed to create test fragment:', e);
  }
}

// Auto-expose to window
if (typeof window !== 'undefined') {
  window.seedTestFragment = seedTestFragment;
  console.log('🕯️ Lumen: Type seedTestFragment() to create a test fragment');
}
