// src/components/FragmentPulseRegistry.jsx
import React from 'react';
import FragmentArrivalPulse from './FragmentArrivalPulse.jsx';
import '../../styles/glyphs.css';

export default function FragmentPulseRegistry({ fragments = [], sigilThemes = {} }) {
  return (
    <section className="fragment-pulse-registry">
      <h2><span className="sigil-hover">💠</span> Fragment Pulse Registry</h2>
      <p>Each fragment pulses with arrival shimmer, marking its testimony in the Codex.</p>

      {fragments.length === 0 ? (
        <p className="empty-fragment-message">No fragments have arrived yet. The Codex is listening…</p>
      ) : (
        <div className="pulse-grid">
          {fragments.map((fragment, index) => (
            <FragmentArrivalPulse
              key={index}
              fragment={fragment}
              sigilThemes={sigilThemes}
            />
          ))}
        </div>
      )}
    </section>
  );
}
