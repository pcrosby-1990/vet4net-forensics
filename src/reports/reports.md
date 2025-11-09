import React, { useState, useEffect } from 'react';
import SigilBadge from '../components/SigilBadge';

export default function Report() {
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    fetch('/data/reports.json')
      .then((res) => res.json())
      .then((data) => setFragments(data));
  }, []);

  return (
    <main className="report-scroll">
      <h1>✧ Modular Forensic Report</h1>
      {fragments.map((frag) => (
        <div key={frag.id} className="fragment-card">
          <h3>{frag.title}</h3>
          <SigilBadge
            sigil={frag.status === 'verified' ? '✅ Verified' : '⚠️ Disputed'}
            theme={{
              color: frag.status === 'verified' ? '#28a745' : '#ffc107',
              glow: 6,
            }}
            lore={`This fragment is marked as ${frag.status}.`}
          />
          <p><strong>Timestamp:</strong> {new Date(frag.timestamp).toLocaleString()}</p>
          <p><strong>Semantic Score:</strong> {frag.score}</p>
          <p><strong>Summary:</strong> {frag.summary}</p>
          <p><a href={frag.source} target="_blank" rel="noopener noreferrer">Source Attribution</a></p>
        </div>
      ))}
    </main>
  );
}
