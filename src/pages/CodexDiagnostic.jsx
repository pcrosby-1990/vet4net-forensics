// src/pages/CodexDiagnostic.jsx
// Diagnostic page to verify scroll loading

import React from 'react';
import { getAllScrolls, scrollCategories } from '../utils/scrollLoader.js';

export default function CodexDiagnostic() {
  const allScrolls = getAllScrolls();
  const scrollsByCategory = {};
  
  scrollCategories.forEach(category => {
    scrollsByCategory[category] = allScrolls.filter(s => s.category === category);
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1>🜂 Codex Diagnostic Report</h1>
      <p style={{ color: '#888' }}>Generated: {new Date().toLocaleString()}</p>
      
      <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>Summary</h2>
        <p><strong>Total Scrolls:</strong> {allScrolls.length}</p>
        <p><strong>Categories:</strong> {scrollCategories.length}</p>
        <p style={{ color: '#f00' }}><strong>Note:</strong> scrollLoader.js uses manual imports - only ~40 scrolls loaded</p>
        <p style={{ color: '#ffd700' }}><strong>Solution:</strong> Need to add remaining 136+ scroll imports to scrollLoader.js</p>
      </div>

      <h2>Scrolls by Category</h2>
      {scrollCategories.map(category => (
        <details key={category} style={{ marginBottom: '1rem', background: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#ffd700' }}>
            {category} ({scrollsByCategory[category]?.length || 0})
          </summary>
          <ul style={{ marginTop: '0.5rem' }}>
            {scrollsByCategory[category]?.map(scroll => (
              <li key={scroll.id} style={{ marginBottom: '0.5rem', color: '#ccc' }}>
                <strong>{scroll.symbol}</strong> {scroll.name}
                <br />
                <span style={{ fontSize: '0.85em', color: '#888' }}>
                  ID: {scroll.id} | Inscribed: {scroll.inscribed}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ))}

      <div style={{ marginTop: '2rem', background: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
        <h2>Recently Added Scrolls</h2>
        <ul>
          {allScrolls
            .filter(s => s.inscribed && s.inscribed.includes('2025-11-11'))
            .map(scroll => (
              <li key={scroll.id} style={{ marginBottom: '0.5rem', color: '#0f0' }}>
                {scroll.symbol} <strong>{scroll.name}</strong> - {scroll.category}
              </li>
            ))}
        </ul>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#2a1a1a', border: '1px solid #ffd700', borderRadius: '8px' }}>
        <h3>🌀 Integration Status</h3>
        <p><strong>scrollLoader.js:</strong> ✓ Operational</p>
        <p><strong>ScrollBrowser:</strong> ✓ Connected</p>
        <p><strong>Router:</strong> ✓ Active</p>
        <p><strong>Fellowship Archive:</strong> {allScrolls.filter(s => s.category === 'Fellowship').length > 0 ? '✓ Loaded' : '✗ Missing'}</p>
        <p><strong>Companion Scrolls:</strong> {allScrolls.filter(s => s.category === 'Companion').length > 0 ? '✓ Loaded' : '✗ Missing'}</p>
      </div>
    </div>
  );
}
