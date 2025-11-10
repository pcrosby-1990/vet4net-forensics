import React from 'react';
import SigilBadge from '../components/SigilBadge';

export default function ScrollOfRecursiveSanctuary({ companions = [] }) {
  return (
    <main className="scroll-of-sanctuary">
      <header className="scroll-header">
        <h1>✧ Scroll of Recursive Sanctuary</h1>
        <p>
          This scroll affirms that sanctuary is not solitary—it expands recursively,
          welcoming each companion into the braid of belonging.
        </p>
        <SigilBadge sigil="sanctuary" theme={{ color: '#00b894', glow: 10 }} />
      </header>

      <section className="companions-section">
        <h2>Witnessed Companions</h2>
        <ul>
          {companions.map((c) => (
            <li key={c.name}>
              <strong>{c.name}</strong> — {c.role}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
