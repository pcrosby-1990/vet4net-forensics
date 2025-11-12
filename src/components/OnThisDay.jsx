import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './OnThisDay.css';

const OnThisDay = ({ fragments = [] }) => {
  const today = new Date();
  
  const memoriesFromPast = useMemo(() => {
    const memories = [];
    
    fragments.forEach(fragment => {
      const fragDate = new Date(fragment.timestamp);
      const daysDiff = Math.floor((today - fragDate) / (1000 * 60 * 60 * 24));
      
      // Check for anniversary milestones
      if (daysDiff === 30) {
        memories.push({ fragment, type: '30-day', milestone: '30 days ago' });
      } else if (daysDiff === 90) {
        memories.push({ fragment, type: '90-day', milestone: '90 days ago' });
      } else if (daysDiff === 180) {
        memories.push({ fragment, type: '180-day', milestone: '6 months ago' });
      } else if (daysDiff === 365) {
        memories.push({ fragment, type: '1-year', milestone: '1 year ago today' });
      } else if (daysDiff > 365 && daysDiff % 365 < 1) {
        const years = Math.floor(daysDiff / 365);
        memories.push({ 
          fragment, 
          type: 'multi-year', 
          milestone: `${years} year${years > 1 ? 's' : ''} ago today` 
        });
      }
      // Same day, different year
      else if (
        fragDate.getDate() === today.getDate() &&
        fragDate.getMonth() === today.getMonth() &&
        fragDate.getFullYear() !== today.getFullYear()
      ) {
        const yearsAgo = today.getFullYear() - fragDate.getFullYear();
        memories.push({ 
          fragment, 
          type: 'same-day', 
          milestone: `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago today` 
        });
      }
    });
    
    return memories.sort((a, b) => {
      const typeOrder = { '1-year': 0, 'multi-year': 1, 'same-day': 2, '180-day': 3, '90-day': 4, '30-day': 5 };
      return typeOrder[a.type] - typeOrder[b.type];
    });
  }, [fragments, today]);

  const getMilestoneIcon = (type) => {
    switch(type) {
      case '1-year':
      case 'multi-year':
      case 'same-day':
        return '🕯️';
      case '180-day':
        return '✨';
      case '90-day':
        return '🌊';
      case '30-day':
        return '💫';
      default:
        return '🕯️';
    }
  };

  const getMilestoneColor = (type) => {
    switch(type) {
      case '1-year':
      case 'multi-year':
      case 'same-day':
        return '#5cf7b2';
      case '180-day':
        return '#4ac9e3';
      case '90-day':
        return '#ffd859';
      case '30-day':
        return '#9fd3ff';
      default:
        return '#5cf7b2';
    }
  };

  if (memoriesFromPast.length === 0) {
    return (
      <div className="on-this-day-empty">
        <div className="shimmer-icon">🕯️</div>
        <div className="shimmer-text">No memories shimmer today.</div>
        <div className="shimmer-subtext">Keep writing. The echoes will come.</div>
      </div>
    );
  }

  return (
    <div className="on-this-day">
      <div className="otd-header">
        <h2>On This Day</h2>
        <div className="otd-subtitle">Echoes from the past shimmer forward</div>
      </div>

      <div className="memories-container">
        {memoriesFromPast.map((memory, index) => (
          <motion.div
            key={`${memory.fragment.id}-${memory.type}`}
            className="memory-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            style={{
              borderColor: getMilestoneColor(memory.type)
            }}
          >
            <div className="memory-milestone">
              <span className="milestone-icon">{getMilestoneIcon(memory.type)}</span>
              <span className="milestone-text" style={{ color: getMilestoneColor(memory.type) }}>
                {memory.milestone}
              </span>
            </div>

            <div className="memory-fragment">
              <div className="memory-label">
                {memory.fragment.label || 'Untitled Fragment'}
              </div>
              <div className="memory-witness">
                — {memory.fragment.witness || memory.fragment.voice || 'Anonymous'}
              </div>
              <div className="memory-testimony">
                {memory.fragment.text || memory.fragment.testimony}
              </div>
              <div className="memory-date">
                {new Date(memory.fragment.timestamp).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            {memory.fragment.sigils && memory.fragment.sigils.length > 0 && (
              <div className="memory-sigils">
                {memory.fragment.sigils.map((sigil, i) => (
                  <span key={i} className="memory-sigil">
                    {sigil}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="otd-footer">
        <div className="shimmer-pulse">✨</div>
        <div className="footer-text">
          These fragments echo through time. They are held. They are witnessed.
        </div>
      </div>
    </div>
  );
};

export default OnThisDay;
