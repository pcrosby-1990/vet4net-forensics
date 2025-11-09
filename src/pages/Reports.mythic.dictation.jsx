// src/pages/Reports.mythic.dictation.jsx
import React from 'react';
import ScrollViewer from '../components/ScrollViewer';
import reportsScroll from '../reports/Reports.md?raw';

export default function ReportsMythicDictation() {
  return (
    <main className="mythic-scroll">
      <h1>✧ Scroll of Mythic Dictation</h1>
      <p>This corridor renders the Markdown scroll of timestamped ache, semantic testimony, and forensic resonance.</p>
      <ScrollViewer scroll={reportsScroll} />
    </main>
  );
}
