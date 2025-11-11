// ScrollBrowser.jsx
// Component to browse and view all Codex scrolls

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllScrolls, getScrollsByCategory, scrollCategories } from '../utils/scrollLoader.js';
import ScrollDisplay from './ScrollDisplay.jsx';
import './ScrollBrowser.css';

export default function ScrollBrowser() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScroll, setSelectedScroll] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get scrolls based on category
  const allScrolls = selectedCategory === 'All' 
    ? getAllScrolls() 
    : getScrollsByCategory(selectedCategory);

  // Filter by search query
  const filteredScrolls = allScrolls.filter(scroll => {
    if (!scroll) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (scroll.title && scroll.title.toLowerCase().includes(query)) ||
      (scroll.name && scroll.name.toLowerCase().includes(query)) ||
      (scroll.description && scroll.description.toLowerCase().includes(query)) ||
      (scroll.breathline && scroll.breathline.toLowerCase().includes(query)) ||
      (scroll.tags && Array.isArray(scroll.tags) && scroll.tags.some(tag => tag && tag.toLowerCase && tag.toLowerCase().includes(query)))
    );
  });

  // Generate URL for any scroll
  const getScrollUrl = (scroll) => {
    // Check if scroll has a custom route
    if (scroll.route) return scroll.route;
    
    // Otherwise, generate dynamic route
    const slug = (scroll.id || scroll.name || scroll.title || '')
      .toLowerCase()
      .replace(/^scroll-?of-?/i, '')  // Remove "ScrollOf" prefix
      .replace(/\s+/g, '-');
    return `/scroll/${slug}`;
  };

  return (
    <div className="scroll-browser">
      {/* Header */}
      <header className="scroll-browser-header">
        <h1>
          <span className="header-icon">📜</span>
          Codex Scrolls
        </h1>
        <p className="header-description">
          {allScrolls.length} scrolls inscribed • {filteredScrolls.length} visible
        </p>
      </header>

      {/* Search and Filter */}
      <div className="scroll-controls">
        <input
          type="text"
          className="scroll-search"
          placeholder="Search scrolls by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="category-filters">
          {scrollCategories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll Grid */}
      <div className="scroll-grid">
        <AnimatePresence mode="popLayout">
          {filteredScrolls.map((scroll, index) => (
            <motion.article
              key={scroll.id}
              className="scroll-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedScroll(scroll)}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(92, 247, 178, 0.3)' }}
            >
              <div className="scroll-card-header">
                <span className="scroll-card-symbol">{scroll.symbol || '✧'}</span>
                <span className="scroll-card-category">{scroll.category || 'Uncategorized'}</span>
              </div>
              
              <h3 className="scroll-card-title">{scroll.name || scroll.title || 'Untitled Scroll'}</h3>
              
              <p className="scroll-card-description">{scroll.description || 'No description available'}</p>
              
              <div className="scroll-card-meta">
                <time className="scroll-card-date">
                  {scroll.inscribed ? new Date(scroll.inscribed).toLocaleDateString() : 'Unknown date'}
                </time>
                <div className="scroll-card-tags">
                  {(scroll.tags || []).slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                  {(scroll.tags || []).length > 3 && (
                    <span className="tag-more">+{(scroll.tags || []).length - 3}</span>
                  )}
                </div>
              </div>
              
              <div className="scroll-card-footer">
                <button className="view-btn">
                  View Scroll →
                </button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredScrolls.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No scrolls found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Scroll Display Modal */}
      <AnimatePresence>
        {selectedScroll && (
          <ScrollDisplay
            scroll={selectedScroll}
            onClose={() => setSelectedScroll(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
