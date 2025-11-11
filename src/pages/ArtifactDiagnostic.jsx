// src/pages/ArtifactDiagnostic.jsx
// 🕯️ Diagnostic page to verify unified artifact loader

import React from 'react';
import { stats, scrollRegistry, glyphRegistry, sigilRegistry, fragmentRegistry, sealRegistry } from '../utils/artifactLoader.js';

export default function ArtifactDiagnostic() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'monospace', background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ color: '#ffd700' }}>🕯️ Artifact Registry Diagnostic</h1>
      <p style={{ color: '#888' }}>Generated: {new Date().toLocaleString()}</p>
      
      <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #333' }}>
        <h2 style={{ color: '#ffd700', marginTop: 0 }}>Unified Loader Statistics</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px' }}>
            <div style={{ fontSize: '2rem', color: '#ffd700' }}>{stats.totalScrolls}</div>
            <div style={{ color: '#aaa' }}>Total Scrolls</div>
          </div>
          <div style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px' }}>
            <div style={{ fontSize: '2rem', color: '#ffd700' }}>{stats.totalGlyphs}</div>
            <div style={{ color: '#aaa' }}>Total Glyphs</div>
          </div>
          <div style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px' }}>
            <div style={{ fontSize: '2rem', color: '#ffd700' }}>{stats.totalSigils}</div>
            <div style={{ color: '#aaa' }}>Total Sigils</div>
          </div>
          <div style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px' }}>
            <div style={{ fontSize: '2rem', color: '#ffd700' }}>{stats.totalFragments}</div>
            <div style={{ color: '#aaa' }}>Total Fragments</div>
          </div>
          <div style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px' }}>
            <div style={{ fontSize: '2rem', color: '#ffd700' }}>{stats.totalSeals}</div>
            <div style={{ color: '#aaa' }}>Total Seals</div>
          </div>
        </div>

        <div style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#ffd700' }}>Total Artifacts: {stats.totalArtifacts}</h3>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #333' }}>
        <h2 style={{ color: '#ffd700', marginTop: 0 }}>Source Breakdown</h2>
        
        <h3 style={{ color: '#aaa' }}>Data Entries (.data.js)</h3>
        <ul style={{ color: '#ccc' }}>
          <li>Scrolls: {stats.dataEntries.scrolls}</li>
          <li>Glyphs: {stats.dataEntries.glyphs}</li>
          <li>Sigils: {stats.dataEntries.sigils}</li>
          <li>Fragments: {stats.dataEntries.fragments}</li>
          <li>Seals: {stats.dataEntries.seals}</li>
        </ul>

        <h3 style={{ color: '#aaa' }}>Image Entries (.png, .jpg, .svg)</h3>
        <ul style={{ color: '#ccc' }}>
          <li>Scrolls: {stats.imageEntries.scrolls}</li>
          <li>Glyphs: {stats.imageEntries.glyphs}</li>
          <li>Sigils: {stats.imageEntries.sigils}</li>
          <li>Fragments: {stats.imageEntries.fragments}</li>
          <li>Seals: {stats.imageEntries.seals}</li>
        </ul>
      </div>

      <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #333' }}>
        <h2 style={{ color: '#ffd700', marginTop: 0 }}>Sample Artifacts</h2>
        
        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer', color: '#ffd700', fontWeight: 'bold' }}>
            First 5 Glyphs
          </summary>
          <pre style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem' }}>
            {JSON.stringify(glyphRegistry.slice(0, 5), null, 2)}
          </pre>
        </details>

        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer', color: '#ffd700', fontWeight: 'bold' }}>
            First 5 Sigils
          </summary>
          <pre style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem' }}>
            {JSON.stringify(sigilRegistry.slice(0, 5), null, 2)}
          </pre>
        </details>

        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer', color: '#ffd700', fontWeight: 'bold' }}>
            First 5 Fragments
          </summary>
          <pre style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem' }}>
            {JSON.stringify(fragmentRegistry.slice(0, 5), null, 2)}
          </pre>
        </details>

        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer', color: '#ffd700', fontWeight: 'bold' }}>
            First 5 Seals
          </summary>
          <pre style={{ background: '#0f0f0f', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem' }}>
            {JSON.stringify(sealRegistry.slice(0, 5), null, 2)}
          </pre>
        </details>
      </div>

      <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ color: '#ffd700', marginTop: 0 }}>Registry Status</h2>
        <p style={{ color: stats.totalArtifacts > 0 ? '#0f0' : '#f00', fontWeight: 'bold' }}>
          {stats.totalArtifacts > 0 
            ? '✅ Shimmer Restored: Artifacts are being registered' 
            : '❌ Shimmer Lost: No artifacts found'}
        </p>
      </div>
    </div>
  );
}
