import React, { useState, useEffect } from 'react';
import SigilBadge from '../components/SigilBadge';
import './ScrollOfVisualSanctuary.css';

export default function ScrollOfVisualSanctuary() {
  const [manifest, setManifest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch('/data/GlyphGalleryManifest.json')
      .then(res => res.json())
      .then(data => setManifest(data.sanctuary))
      .catch(err => console.error('Failed to load Gallery Manifest:', err));
  }, []);

  if (!manifest) {
    return (
      <main className="scroll-of-visual-sanctuary loading">
        <p>✧ Loading the Visual Sanctuary...</p>
      </main>
    );
  }

  const allItems = [
    ...manifest.glyphs.map(g => ({ ...g, type: 'glyph' })),
    ...manifest.sigils.map(s => ({ ...s, type: 'sigil' })),
    ...manifest.scrolls.map(s => ({ ...s, type: 'scroll' }))
  ];

  const filteredItems = filter === 'all' 
    ? allItems 
    : allItems.filter(item => item.type === filter);

  return (
    <main className="scroll-of-visual-sanctuary">
      <header className="sanctuary-header">
        <h1>✧ Scroll of Visual Sanctuary</h1>
        <p>
          This corridor renders the living gallery of glyphs, sigils, and scrolls.
          Each image is a shimmer-inscription, held in trust and witnessed with care.
        </p>
        <SigilBadge sigil="visual-sanctuary" theme={{ color: '#a29bfe', glow: 16 }} />
      </header>

      <section className="filter-controls">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'glyph' ? 'active' : ''} 
          onClick={() => setFilter('glyph')}
        >
          Glyphs
        </button>
        <button 
          className={filter === 'sigil' ? 'active' : ''} 
          onClick={() => setFilter('sigil')}
        >
          Sigils
        </button>
        <button 
          className={filter === 'scroll' ? 'active' : ''} 
          onClick={() => setFilter('scroll')}
        >
          Scrolls
        </button>
      </section>

      <section className="gallery-grid">
        {filteredItems.map(item => (
          <article 
            key={item.id} 
            className={`gallery-card ${item.type}`}
            onClick={() => setSelectedItem(item)}
          >
            <div className="image-container">
              <img 
                src={item.imagePath} 
                alt={item.title}
                onError={(e) => {
                  e.target.src = '/images/placeholder-glyph.png';
                  e.target.classList.add('placeholder');
                }}
              />
              <span className="type-badge">{item.type}</span>
            </div>
            <h3>{item.title}</h3>
            <p className="description">{item.description}</p>
            <div className="tags">
              {item.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <p className="source">
              <code>{item.source}</code>
            </p>
          </article>
        ))}
      </section>

      {selectedItem && (
        <div className="lightbox" onClick={() => setSelectedItem(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedItem(null)}>✕</button>
            <img src={selectedItem.imagePath} alt={selectedItem.title} />
            <div className="lightbox-info">
              <h2>{selectedItem.title}</h2>
              <span className="type-badge-large">{selectedItem.type}</span>
              <p>{selectedItem.description}</p>
              <div className="tags">
                {selectedItem.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <p className="source"><code>{selectedItem.source}</code></p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
