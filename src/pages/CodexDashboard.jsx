// src/pages/CodexDashboard.jsx
import React, { useState } from 'react';
import CodexViewer from '../components/CodexViewer.jsx';
import CodexStats from '../components/CodexStats.jsx';
import CodexTimeline from '../components/CodexTimeline.jsx';
import SealedFragments from '../components/SealedFragments.jsx';
import EditorPanel from '../SSJ/components/EditorPanel.jsx';
import LumenChat from '../components/LumenChat.jsx';
import { SIGIL_LORE, SIGIL_DEFAULT_THEME } from '../components/sigilConfig.js';

export default function CodexDashboard({ 
  fragments = [], 
  sigilThemes = {},
  setFragments,
  onFragmentSubmit 
}) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterSigil, setFilterSigil] = useState('');

  // Helper function to convert EditorPanel payload to full fragment format
  const handleEditorSubmit = (payload) => {
    const fragment = {
      id: `frag-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: payload.text.trim(),
      sigils: payload.sigils || [],
      collapseRisk: payload.collapseRisk || 'soft',
      breathline: payload.breathline || '',
      timestamp: new Date().toISOString(),
      witness: payload.witness || 'patrick-crosby 🜎',
      revisionHistory: [],
      echoStatus: 'sealed',
    };
    
    // Save to localStorage so the polling in App.jsx picks it up
    try {
      const existing = JSON.parse(localStorage.getItem('spiralCodex') || '[]');
      const updated = [fragment, ...existing];
      localStorage.setItem('spiralCodex', JSON.stringify(updated));
      
      // Also call the provided callback if it exists
      if (onFragmentSubmit) {
        onFragmentSubmit(fragment);
      }
    } catch (e) {
      console.error('Failed to save fragment:', e);
    }
  };

  return (
    <main className="codex-dashboard">
      <h1>✧ Codex Dashboard</h1>
      <p>This corridor displays all active fragments, sigil stats, and timeline glyphs.</p>

      <section className="fragment-generator">
        <h2>✦ Fragment Generator</h2>
        <EditorPanel 
          onSubmit={handleEditorSubmit}
          fragments={fragments}
          sigilThemes={sigilThemes}
          SIGIL_LORE={SIGIL_LORE}
          SIGIL_DEFAULT_THEME={SIGIL_DEFAULT_THEME}
        />
      </section>

      <CodexStats fragments={fragments} sigilThemes={sigilThemes} />
      <CodexTimeline fragments={fragments} />

      <SealedFragments
        fragments={fragments}
        sigilThemes={sigilThemes}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterSigil={filterSigil}
        setFilterSigil={setFilterSigil}
      />

      <CodexViewer fragments={fragments} sigilThemes={sigilThemes} />

      {/* 🔥 LUMEN IS NOW PRESENT IN THE CODEX 🔥 */}
      <LumenChat 
        fragments={fragments} 
        onFragmentCreate={onFragmentSubmit}
      />
    </main>
  );
}
