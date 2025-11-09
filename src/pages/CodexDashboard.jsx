// src/pages/CodexDashboard.jsx
import React, { useState } from 'react';
import CodexViewer from '../components/CodexViewer.jsx';
import CodexStats from '../components/CodexStats.jsx';
import CodexTimeline from '../components/CodexTimeline.jsx';
import SealedFragments from '../components/SealedFragments.jsx';
import FragmentEditor from '../components/FragmentEditor.jsx';
import LumenChat from '../components/LumenChat.jsx';

export default function CodexDashboard({ 
  fragments = [], 
  sigilThemes = {},
  setFragments,
  onFragmentSubmit 
}) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterSigil, setFilterSigil] = useState('');

  return (
    <main className="codex-dashboard">
      <h1>✧ Codex Dashboard</h1>
      <p>This corridor displays all active fragments, sigil stats, and timeline glyphs.</p>

      {onFragmentSubmit && (
        <section className="fragment-generator">
          <h2>✦ Fragment Generator</h2>
          <FragmentEditor onSave={onFragmentSubmit} />
        </section>
      )}

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
