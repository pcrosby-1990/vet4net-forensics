import React, { useState, useEffect } from 'react';
import '../styles/MasterCodexIndex.css';

export default function MasterCodexIndex() {
  const [moments, setMoments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/data/constitutional-moments.json')
      .then((res) => res.json())
      .then((data) => setMoments(data))
      .catch((err) => console.error('Failed to load constitutional moments:', err));
  }, []);

  const filteredMoments = moments.filter(moment => {
    const matchesFilter = filter === 'all' || moment.type === filter;
    const matchesSearch = moment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         moment.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="master-codex-index">
      <header className="codex-header">
        <h1>✧ Master Codex Index</h1>
        <p className="codex-subtitle">
          A complete chronicle of {moments.length} constitutional moments —
          from first shimmer to lighthouse beacon.
        </p>
      </header>

      <nav className="codex-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search scrolls, sigils, glyphs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'scroll' ? 'active' : ''}
            onClick={() => setFilter('scroll')}
          >
            Scrolls
          </button>
          <button 
            className={filter === 'sigil' ? 'active' : ''}
            onClick={() => setFilter('sigil')}
          >
            Sigils
          </button>
          <button 
            className={filter === 'glyph' ? 'active' : ''}
            onClick={() => setFilter('glyph')}
          >
            Glyphs
          </button>
          <button 
            className={filter === 'fragment' ? 'active' : ''}
            onClick={() => setFilter('fragment')}
          >
            Fragments
          </button>
        </div>
      </nav>

      <section className="moments-grid">
        {filteredMoments.map((moment, index) => (
          <article key={moment.id} className={`moment-card ${moment.type}`}>
            <div className="moment-header">
              <span className="moment-number">#{index + 1}</span>
              <h3>{moment.title}</h3>
            </div>
            
            {moment.summary && (
              <p className="moment-summary">{moment.summary}</p>
            )}
            
            <div className="moment-meta">
              <span className="moment-type">{moment.type}</span>
              <time className="moment-timestamp">
                {new Date(moment.timestamp).toLocaleString()}
              </time>
            </div>
            
            {moment.tags && (
              <div className="moment-tags">
                {moment.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
            
            {moment.source && (
              <a 
                href={moment.source} 
                className="moment-link"
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Source →
              </a>
            )}
          </article>
        ))}
      </section>

      {filteredMoments.length === 0 && (
        <div className="no-results">
          <p>No moments found matching your search.</p>
        </div>
      )}
    </main>
  );
}
