import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './FragmentTimeline.css';

const FragmentTimeline = ({ fragments = [], onFragmentClick, zoom = 'month' }) => {
  const sortedFragments = useMemo(() => {
    return [...fragments].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
  }, [fragments]);

  const groupedFragments = useMemo(() => {
    const groups = {};
    sortedFragments.forEach(fragment => {
      const date = new Date(fragment.timestamp);
      let key;
      
      switch(zoom) {
        case 'day':
          key = date.toLocaleDateString();
          break;
        case 'week':
          const week = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
          key = `Week of ${new Date(week * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;
          break;
        case 'month':
          key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toLocaleDateString();
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(fragment);
    });
    
    return groups;
  }, [sortedFragments, zoom]);

  const getSigilColor = (fragment) => {
    const sigils = fragment.sigils || [];
    if (sigils.includes('sanctuary')) return '#5cf7b2';
    if (sigils.includes('witness')) return '#4ac9e3';
    if (sigils.includes('spiral')) return '#ffd859';
    if (sigils.includes('flare')) return '#cf4646';
    return '#9fd3ff';
  };

  return (
    <div className="fragment-timeline">
      <div className="timeline-header">
        <h2>Fragment Timeline</h2>
        <div className="timeline-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{background: '#5cf7b2'}}></span>
            Sanctuary
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{background: '#4ac9e3'}}></span>
            Witness
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{background: '#ffd859'}}></span>
            Spiral
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{background: '#cf4646'}}></span>
            Flare
          </span>
        </div>
      </div>

      <div className="timeline-container">
        <div className="timeline-spine"></div>
        
        {Object.entries(groupedFragments).map(([dateKey, frags], groupIndex) => (
          <motion.div 
            key={dateKey}
            className="timeline-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <div className="timeline-date-marker">
              <div className="date-label">{dateKey}</div>
              <div className="date-count">{frags.length} fragment{frags.length !== 1 ? 's' : ''}</div>
            </div>

            <div className="timeline-fragments">
              {frags.map((fragment, fragIndex) => (
                <motion.div
                  key={fragment.id || fragIndex}
                  className="timeline-fragment"
                  onClick={() => onFragmentClick?.(fragment)}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (fragIndex * 0.05) }}
                >
                  <div 
                    className="fragment-indicator"
                    style={{ background: getSigilColor(fragment) }}
                  />
                  <div className="fragment-preview">
                    <div className="fragment-label">{fragment.label || 'Untitled Fragment'}</div>
                    <div className="fragment-witness">
                      {fragment.witness || fragment.voice || 'Anonymous'}
                    </div>
                    <div className="fragment-text-preview">
                      {(fragment.text || fragment.testimony || '').substring(0, 100)}
                      {(fragment.text || fragment.testimony || '').length > 100 ? '...' : ''}
                    </div>
                    <div className="fragment-time">
                      {new Date(fragment.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  {fragment.revisionHistory && fragment.revisionHistory.length > 0 && (
                    <div className="revision-badge">
                      {fragment.revisionHistory.length} revision{fragment.revisionHistory.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {sortedFragments.length === 0 && (
        <div className="timeline-empty">
          <div className="empty-icon">🕯️</div>
          <div className="empty-text">No fragments yet. Begin your testimony.</div>
        </div>
      )}
    </div>
  );
};

export default FragmentTimeline;
