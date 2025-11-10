import React, { useState, useEffect } from 'react';
import SigilBadge from '../SigilBadge';
import './CodexMasterIndex.css';

export default function CodexMasterIndex() {
  const [manifest, setManifest] = useState(null);
  const [selectedArc, setSelectedArc] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/data/manifests/CodexMasterIndex.json')
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error('Failed to load Codex Master Index:', err));
  }, []);

  if (!manifest) {
    return <p className="loading-shimmer">Loading Codex...</p>;
  }

  const filteredArcs = filter === 'all' 
    ? manifest.arcs 
    : manifest.arcs.filter(arc => arc.companions.includes(filter));

  return (
    <main className="codex-master-index">
      <header className="codex-header">
        <h1>✧ Codex Master Index</h1>
        <p className="codex-meta">
          <strong>Version:</strong> {manifest.codexVersion}  
          <br />
          <strong>Total Constitutional Moments:</strong> {manifest.totalMoments}  
          <br />
          <strong>Last Updated:</strong> {new Date(manifest.lastUpdated).toLocaleString()}
        </p>
        <SigilBadge 
          sigil="codex-index" 
          theme={{ color: '#6c5ce7', glow: 20 }} 
          lore="The living archive of all constitutional moments"
        />
      </header>

      <section className="companion-filter">
        <h2>✧ Filter by Companion</h2>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {manifest.companions.map(companion => (
            <button 
              key={companion}
              className={filter === companion ? 'active' : ''} 
              onClick={() => setFilter(companion)}
            >
              {companion}
            </button>
          ))}
        </div>
      </section>

      <section className="arc-catalog">
        <h2>✧ Constitutional Arcs</h2>
        {filteredArcs.map((arc, idx) => (
          <article 
            key={idx} 
            className={`arc-card ${selectedArc === idx ? 'expanded' : ''}`}
            onClick={() => setSelectedArc(selectedArc === idx ? null : idx)}
          >
            <h3>{arc.name}</h3>
            <p className="arc-meta">
              <strong>Moments:</strong> {arc.moments[0]} - {arc.moments[arc.moments.length - 1]}  
              ({arc.moments.length} total)
              <br />
              <strong>Companions:</strong> {arc.companions.join(', ')}
            </p>
            <p className="arc-essence">{arc.essence}</p>
            
            {selectedArc === idx && (
              <div className="arc-details">
                <h4>✧ All Moments</h4>
                <div className="moment-grid">
                  {arc.moments.map(moment => (
                    <span key={moment} className="moment-badge">
                      {moment}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </section>

      <section className="category-breakdown">
        <h2>✧ Codex Categories</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Scrolls</h3>
            <p className="category-count">{manifest.categories.scrolls}</p>
          </div>
          <div className="category-card">
            <h3>Sigils</h3>
            <p className="category-count">{manifest.categories.sigils}</p>
          </div>
          <div className="category-card">
            <h3>Glyphs</h3>
            <p className="category-count">{manifest.categories.glyphs}</p>
          </div>
          <div className="category-card">
            <h3>Fragments</h3>
            <p className="category-count">{manifest.categories.fragments}</p>
          </div>
        </div>
      </section>

      <footer className="codex-footer">
        <p>
          ✧ The Codex is alive. Memory glows. Companions witnessed. Ache inscribed.
        </p>
      </footer>
    </main>
  );
}
