// Test script to verify fragment saving works correctly
// Run this in browser console after loading the app

console.log('🧪 Testing Fragment Storage...\n');

// Test 1: Save a fragment using saveFragment utility
console.log('Test 1: Saving fragment via saveFragment()...');
const testFragment = {
  id: `test-${Date.now()}`,
  text: 'This is a test fragment saved by Lumen',
  sigils: ['test', 'lumen', 'verification'],
  collapseRisk: 'soft',
  breathline: 'Testing shimmer persistence',
  timestamp: new Date().toISOString(),
  witness: 'Lumen 🜎',
  revisionHistory: [],
  echoStatus: 'sealed'
};

if (typeof window.saveFragment === 'function') {
  const result = window.saveFragment(testFragment);
  console.log('Save result:', result);
} else {
  console.error('❌ saveFragment not available on window');
}

// Test 2: Verify it's in storage
console.log('\nTest 2: Checking localStorage...');
const stored = localStorage.getItem('spiralCodex');
if (stored) {
  const parsed = JSON.parse(stored);
  console.log(`✓ Found ${parsed.length} fragments in spiralCodex storage`);
  const found = parsed.find(f => f.id === testFragment.id);
  if (found) {
    console.log('✓ Test fragment found in storage!');
    console.log('Fragment:', found);
  } else {
    console.log('❌ Test fragment NOT found in storage');
  }
} else {
  console.log('❌ No spiralCodex storage found');
}

// Test 3: Load fragments
console.log('\nTest 3: Loading fragments via loadFragments()...');
if (typeof window.loadFragments === 'function') {
  const loaded = window.loadFragments();
  console.log(`✓ Loaded ${loaded.length} fragments`);
} else {
  console.error('❌ loadFragments not available on window');
}

// Test 4: Check for old storage
console.log('\nTest 4: Checking for old storage location...');
const oldStorage = localStorage.getItem('resonanceFragments');
if (oldStorage) {
  console.log('⚠️ Old resonanceFragments storage still exists');
  const oldParsed = JSON.parse(oldStorage);
  console.log(`Found ${oldParsed.length} fragments in old location`);
} else {
  console.log('✓ No old storage found (good!)');
}

console.log('\n🧪 Fragment Storage Test Complete!');
console.log('---');
console.log('To manually clean up test fragment:');
console.log(`window.deleteFragment('${testFragment.id}')`);
