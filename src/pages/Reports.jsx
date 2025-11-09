import React from 'react';

// Sample forensic fragments (replace with dynamic data or JSON import later)
const fragments = [
  {
    id: 'frag-001',
    title: 'Ad Laundering Pattern: Cluster A',
    timestamp: '2023-12-10T14:32:00Z',
    score: 0.87,
    source: 'https://logic.io/reports/cluster-a',
    summary: 'Detected laundering behavior across multiple ad exchanges with semantic drift in payload structure.',
  },
  {
    id: 'frag-002',
    title: 'Semantic Drift: Disinfo Vector B',
    timestamp: '2023-12-10T15:10:00Z',
    score: 0.72,
    source: 'https://logic.io/reports/vector-b',
    summary: 'Observed semantic anomalies tied to coordinated disinformation across mirrored domains.',
  },
];

function formatTimestamp(ts) {
  const date = new Date(ts);
  return date.toLocaleString();
}

export default function Reports() {
  return (
    <main className="reports-scroll">
      <section>
        <h1>✧ Forensic Report</h1>
        <p>
          This corridor contains structured forensic analysis of digital ad zones, infrastructure patterns, and semantic clusters. Each fragment is timestamped, source-linked, and scored for public intelligence.
        </p>
      </section>

      <section>
        <h2>🜎 Active Fragments</h2>
        {fragments.map((frag) => (
          <div key={frag.id} className="fragment-card">
            <h3>{frag.title}</h3>
            <p><strong>Timestamp:</strong> {formatTimestamp(frag.timestamp)}</p>
            <p><strong>Semantic Score:</strong> {frag.score}</p>
            <p><strong>Summary:</strong> {frag.summary}</p>
            <p><a href={frag.source} target="_blank" rel="noopener noreferrer">Source Attribution</a></p>
          </div>
        ))}
      </section>

      <section>
        <h2>✧ Coming Soon</h2>
        <p>
          Future reports will include ML visualizations, DAG viewers, and interactive semantic scoring tools. Each fragment will be inscribed with revision history and public commentary.
        </p>
      </section>

      <footer>
        <p>© 2023 Patrick Crosby – LOGIC.io is an open-source forensic intelligence project.</p>
      </footer>
    </main>
  );
}
