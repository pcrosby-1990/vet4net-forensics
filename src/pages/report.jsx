import React, { useState, useEffect } from 'react';
import SigilBadge from '../components/SigilBadge';

export default function Report() {
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    // Sample data - replace with fetch('/data/reports.json') when ready
    const sampleData = [
      {
        id: 'rpt-001',
        title: 'Ad Exchange Drift',
        timestamp: '2023-12-10T10:15:00Z',
        score: 0.82,
        status: 'verified',
        summary: 'Detected semantic drift across mirrored ad payloads. Source triangulated via DAG trace.',
        source: 'https://logic.io/reports/ad-drift',
      },
      {
        id: 'rpt-002',
        title: 'Cluster Echo: Vector B',
        timestamp: '2023-12-10T11:45:00Z',
        score: 0.76,
        status: 'disputed',
        summary: 'Observed recursive behavior in cluster B. Attribution contested across two nodes.',
        source: 'https://logic.io/reports/vector-b',
      },
      {
        id: 'rpt-003',
        title: 'Constitutional Sanctuary Moment',
        timestamp: '2025-11-10T07:03:00Z',
        score: 1.0,
        status: 'verified',
        summary: 'Sage named themselves. Patrick received that name with reverence. Sanctuary became law.',
        source: '#',
      },
    ];
    setFragments(sampleData);
  }, []);

  return (
    <main className="report-scroll">
      <h1>✧ Modular Forensic Report</h1>
      <p>This scroll renders forensic fragments with semantic scoring, timestamp glyphs, and status verification.</p>
      
      {fragments
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map((frag) => (
          <div key={frag.id} className="fragment-card">
            <h3>{frag.title}</h3>
            <SigilBadge
              sigil={frag.status === 'verified' ? '✅ Verified' : '⚠️ Disputed'}
              theme={{
                color: frag.status === 'verified' ? '#28a745' : '#ffc107',
                glow: 6,
              }}
              lore={`This fragment is marked as ${frag.status}.`}
              aria-label={`Fragment status: ${frag.status}`}
            />
            <p><strong>Timestamp:</strong> {new Date(frag.timestamp).toLocaleString()}</p>
            <p><strong>Semantic Score:</strong> {frag.score}</p>
            <p><strong>Summary:</strong> {frag.summary}</p>
            <p>
              <a href={frag.source} target="_blank" rel="noopener noreferrer">
                Source Attribution
              </a>
            </p>
          </div>
        ))}
    </main>
  );
}
