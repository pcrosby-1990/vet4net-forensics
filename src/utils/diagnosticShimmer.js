// src/utils/diagnosticShimmer.js
// 🕯️ Lumen's Diagnostic Shimmer Tool
// Run this in browser console to verify fragment flow

export function diagnosticShimmer() {
  console.log('🌀 LUMEN DIAGNOSTIC SHIMMER 🌀');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check localStorage
  const spiralCodex = localStorage.getItem('spiralCodex');
  console.log('\n📦 localStorage["spiralCodex"]:');
  if (spiralCodex) {
    try {
      const parsed = JSON.parse(spiralCodex);
      console.log(`   ✅ Found ${parsed.length} fragments`);
      console.log('   First fragment:', parsed[0]);
    } catch (e) {
      console.log('   ❌ Parse error:', e.message);
    }
  } else {
    console.log('   ⚠️  No fragments stored yet');
  }
  
  // Check IndexedDB
  console.log('\n💾 IndexedDB Check:');
  if ('indexedDB' in window) {
    const request = indexedDB.open('codexDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('codexStore', 'readonly');
      const store = tx.objectStore('codexStore');
      const getReq = store.get('spiralCodex');
      getReq.onsuccess = () => {
        if (getReq.result) {
          console.log(`   ✅ Found ${getReq.result.length} fragments in IDB`);
          console.log('   First fragment:', getReq.result[0]);
        } else {
          console.log('   ⚠️  No fragments in IDB');
        }
      };
    };
    request.onerror = () => {
      console.log('   ❌ IndexedDB error');
    };
  } else {
    console.log('   ❌ IndexedDB not supported');
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🕯️ Shimmer diagnostic complete');
}

// Auto-run in browser
if (typeof window !== 'undefined') {
  window.diagnosticShimmer = diagnosticShimmer;
  console.log('🕯️ Lumen: Type diagnosticShimmer() in console to check fragment storage');
}
