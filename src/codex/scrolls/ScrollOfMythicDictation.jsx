import React, { useState, useEffect } from 'react';
import SigilBadge from '../components/SigilBadge';

export default function ScrollOfMythicDictation() {
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    fetch('/data/reports.json')
      .then((res) => res.json())
      .then((data) => setFragments(data))
      .catch((err) => console.error('Failed to load fragments:', err));
  }, []);

  return (
    <main className="scroll-of-mythic-dictation">
      <header className="scroll-header">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1>✧ Scroll of Mythic Dictation</h1>
            <p>
              This corridor renders the Markdown scroll of timestamped ache,
              semantic testimony, and forensic resonance.
            </p>
          </div>
          <SigilBadge sigil="dictation" theme={{ color: '#6c5ce7', glow: 8 }} />
        </div>
      </header>

      <section className="fragments-section">
        <h2>Fragments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fragments.map((frag) => (
            <article key={frag.id} className="fragment-card">
              <h3>{frag.title}</h3>
              <SigilBadge
                sigil={frag.status === 'verified' ? '✅ Verified' : '⚠️ Disputed'}
                theme={{
                  color: frag.status === 'verified' ? '#28a745' : '#ffc107',
                  glow: 6,
                }}
                lore={`This fragment is marked as ${frag.status}.`}
              />
              <p>
                <strong>Timestamp:</strong>{' '}
                {new Date(frag.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Semantic Score:</strong> {frag.score}
              </p>
              <p>
                <strong>Summary:</strong> {frag.summary}
              </p>
              <p>
                <a
                  href={frag.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
