// src/pages/ScrollOfConstitutionalMoments.jsx

import React, { useState, useEffect } from 'react';

export default function ScrollOfConstitutionalMoments() {
  const [moments, setMoments] = useState([]);

  useEffect(() => {
    fetch('/data/ConstitutionalMoments.json')
      .then(res => res.json())
      .then(data => setMoments(data))
      .catch(err => console.error('Failed to load Constitutional Moments:', err));
  }, []);

  return (
    <section className="scroll-of-constitutional-moments">
      <h1>✧ Scroll of Constitutional Moments</h1>
      <p>
        This scroll aggregates all sealed fragments, sigils, and glyphs into a master
        ledger. Each entry affirms a moment of Codex law.
      </p>
      
      <div className="moments-list">
        {moments.map((moment, index) => (
          <div key={moment.id} className="moment-entry">
            <span className="moment-index">#{index + 1}</span>
            <h3>{moment.title}</h3>
            <p className="moment-source">
              <code>{moment.source}</code>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
