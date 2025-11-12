import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FragmentTimeline from './FragmentTimeline';
import OnThisDay from './OnThisDay';
import RevisionDiff from './RevisionDiff';
import './FragmentArchaeology.css';

const FragmentArchaeology = ({ fragments = [] }) => {
  const [activeView, setActiveView] = useState('timeline');
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [timelineZoom, setTimelineZoom] = useState('month');

  const views = [
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'onthisday', label: 'On This Day', icon: '🕯️' },
    { id: 'revisions', label: 'Revisions', icon: '📜' }
  ];

  const zoomLevels = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
  ];

  return (
    <div className="fragment-archaeology">
      <div className="archaeology-header">
        <div className="header-content">
          <h1>Fragment Archaeology</h1>
          <div className="header-subtitle">
            Witness the evolution of testimony through time
          </div>
        </div>
        <div className="header-stats">
          <div className="stat">
            <div className="stat-value">{fragments.length}</div>
            <div className="stat-label">Fragments</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {fragments.reduce((sum, f) => sum + (f.revisionHistory?.length || 0), 0)}
            </div>
            <div className="stat-label">Revisions</div>
          </div>
          <div className="stat">
            <div className="stat-value">
              {new Set(fragments.map(f => f.witness || f.voice)).size}
            </div>
            <div className="stat-label">Witnesses</div>
          </div>
        </div>
      </div>

      <div className="archaeology-nav">
        {views.map(view => (
          <button
            key={view.id}
            className={`nav-button ${activeView === view.id ? 'active' : ''}`}
            onClick={() => {
              setActiveView(view.id);
              setSelectedFragment(null);
            }}
          >
            <span className="nav-icon">{view.icon}</span>
            <span className="nav-label">{view.label}</span>
          </button>
        ))}
      </div>

      {activeView === 'timeline' && (
        <div className="archaeology-controls">
          <div className="control-group">
            <label>Timeline Zoom:</label>
            <div className="zoom-buttons">
              {zoomLevels.map(zoom => (
                <button
                  key={zoom.id}
                  className={`zoom-button ${timelineZoom === zoom.id ? 'active' : ''}`}
                  onClick={() => setTimelineZoom(zoom.id)}
                >
                  {zoom.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <motion.div
        className="archaeology-content"
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeView === 'timeline' && (
          <FragmentTimeline
            fragments={fragments}
            zoom={timelineZoom}
            onFragmentClick={setSelectedFragment}
          />
        )}

        {activeView === 'onthisday' && (
          <OnThisDay fragments={fragments} />
        )}

        {activeView === 'revisions' && (
          <>
            {!selectedFragment && (
              <div className="select-prompt">
                <div className="prompt-icon">📜</div>
                <div className="prompt-text">
                  Select a fragment from the timeline to view its revision history
                </div>
                <button
                  className="prompt-button"
                  onClick={() => setActiveView('timeline')}
                >
                  Go to Timeline
                </button>
              </div>
            )}
            {selectedFragment && (
              <RevisionDiff fragment={selectedFragment} />
            )}
          </>
        )}
      </motion.div>

      {selectedFragment && activeView !== 'revisions' && (
        <motion.div
          className="selected-fragment-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="panel-header">
            <h3>Selected Fragment</h3>
            <button
              className="close-button"
              onClick={() => setSelectedFragment(null)}
            >
              ✕
            </button>
          </div>
          <div className="panel-content">
            <div className="fragment-label">
              {selectedFragment.label || 'Untitled Fragment'}
            </div>
            <div className="fragment-witness">
              {selectedFragment.witness || selectedFragment.voice || 'Anonymous'}
            </div>
            <div className="fragment-text">
              {selectedFragment.text || selectedFragment.testimony}
            </div>
            <div className="fragment-meta">
              {new Date(selectedFragment.timestamp).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            {selectedFragment.revisionHistory && selectedFragment.revisionHistory.length > 0 && (
              <button
                className="view-revisions-button"
                onClick={() => setActiveView('revisions')}
              >
                View {selectedFragment.revisionHistory.length} Revision
                {selectedFragment.revisionHistory.length !== 1 ? 's' : ''} →
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FragmentArchaeology;
