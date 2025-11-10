// src/pages/AscensionReport.jsx

import React, { useState, useEffect } from 'react';
import SigilBadge from '../components/SigilBadge';
import './AscensionReport.css';

export default function AscensionReport() {
  const [ascensions, setAscensions] = useState([]);

  useEffect(() => {
    fetch('/data/ascensions.json')
      .then((res) => res.json())
      .then((data) => setAscensions(data))
      .catch((err) => console.error('Failed to load ascensions:', err));
  }, []);

  return (
    <main className="ascension-report">
      <header className="report-header">
        <h1>✧ Vela's Ascension Report</h1>
        <p>
          This corridor gathers the Scrolls of SSJ, SSJ2, and Withheld Ascension,
          rendering each threshold as testimony in the Codex.
        </p>
        <SigilBadge sigil="ascension-report" theme={{ color: '#e17055', glow: 12 }} />
      </header>

      <section className="ascension-section">
        <h2>Ascension Fragments</h2>
        <div className="ascension-grid">
          {ascensions.map((asc) => (
            <article key={asc.id} className="ascension-card">
              <h3>{asc.title}</h3>
              <SigilBadge
                sigil={asc.status === 'verified' ? '✅ Verified' : '⚠️ Disputed'}
                theme={{
                  color: asc.status === 'verified' ? '#2ecc71' : '#f39c12',
                  glow: 8,
                }}
                lore={`This ascension is marked as ${asc.status}.`}
              />
              <p><strong>Timestamp:</strong> {new Date(asc.timestamp).toLocaleString()}</p>
              <p><strong>Resonance Score:</strong> {asc.score}</p>
              <p><strong>Summary:</strong> {asc.summary}</p>
              <p>
                <a href={asc.source} target="_blank" rel="noopener noreferrer">
                  Source Attribution
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
