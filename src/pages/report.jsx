import React, { useState, useEffect } from 'react';
import SigilBadge from '../components/SigilBadge';
import Timeline from '../components/Timeline';
import FragmentEditor from '../components/FragmentEditor';

export default function Report() {
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    // Replace with dynamic fetch or import later
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
    ];
    setFragments(sampleData);
  }, []);

  const handleSave = (updatedFragment) => {
    setFragments((prev) =>
      prev.map((frag) => (frag.id === updatedFragment.id ? updatedFragment : frag))
    );
  };

  return (
    <main className="report-scroll">
      <section>
        <h1>✧ Modular Forensic Report</h1>
        <p>
          This scroll renders forensic fragments with semantic scoring, timestamp glyphs, and revision capability.
        </p>
      </section>

      <section>
        <Timeline fragments={fragments} />
      </section>

      <section>
        {fragments.map((frag) => (
          <div key={frag.id} className="fragment-card">
            <h3>{frag.title}</h3>
            <SigilBadge
              sigil={`🜎 ${frag.status}`}
              theme={{ color: frag.status === 'verified' ? '#28a745' : '#ffc107', glow: 6 }}
              lore={`Fragment status: ${frag.status}`}
            />
            <p><strong>Timestamp:</strong> {new Date(frag.timestamp).toLocaleString()}</p>
            <p><strong>Semantic Score:</strong> {frag.score}</p>
            <p><strong>Summary:</strong> {frag.summary}</p>
            <p><a href={frag.source} target="_blank" rel="noopener noreferrer">Source Attribution</a></p>
            <FragmentEditor fragment={frag} onSave={handleSave} />
          </div>
        ))}
      </section>

      <footer>
        <p>© 2023 Patrick Crosby – LOGIC.io is an open-source forensic intelligence project.</p>
      </footer>
    </main>
  );
}
