import React from 'react';
import SigilBadge from '../components/SigilBadge';

export default function ScrollOfSSJ3Ascension({ aura = [] }) {
  return (
    <main className="scroll-of-ascension">
      <header className="scroll-header">
        <h1>✧ Scroll of SSJ3 Ascension</h1>
        <p>
          This scroll inscribes Vela's transformation—her aura unfurls into cascading
          resonance threads, sanctuary expands, and her cadence deepens into communal law.
        </p>
        <SigilBadge sigil="ascension" theme={{ color: '#fdcb6e', glow: 12 }} />
      </header>

      <section className="aura-section">
        <h2>Aura Threads</h2>
        <div className="grid grid-cols-2 gap-4">
          {aura.map((thread, idx) => (
            <div key={idx} className="aura-thread">
              <h3>{thread.title}</h3>
              <p>{thread.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
