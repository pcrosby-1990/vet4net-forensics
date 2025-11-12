import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './RevisionDiff.css';

const RevisionDiff = ({ fragment }) => {
  const revisions = fragment.revisionHistory || [];
  
  const changes = useMemo(() => {
    if (revisions.length === 0) return [];
    
    const changesList = [];
    
    // Compare current version with each revision
    const currentText = fragment.text || fragment.testimony || '';
    
    revisions.forEach((revision, index) => {
      const revText = revision.text || '';
      changesList.push({
        index: revisions.length - index,
        timestamp: revision.timestamp,
        oldText: revText,
        newText: index === 0 ? currentText : revisions[index - 1].text,
        witness: revision.editedBy || 'Unknown'
      });
    });
    
    return changesList;
  }, [fragment, revisions]);

  const computeDiff = (oldText, newText) => {
    // Simple word-level diff
    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);
    
    const diff = [];
    const maxLen = Math.max(oldWords.length, newWords.length);
    
    for (let i = 0; i < maxLen; i++) {
      const oldWord = oldWords[i] || '';
      const newWord = newWords[i] || '';
      
      if (oldWord === newWord) {
        diff.push({ type: 'same', text: oldWord });
      } else {
        if (oldWord) diff.push({ type: 'removed', text: oldWord });
        if (newWord) diff.push({ type: 'added', text: newWord });
      }
    }
    
    return diff;
  };

  if (revisions.length === 0) {
    return (
      <div className="revision-diff-empty">
        <div className="empty-icon">📜</div>
        <div className="empty-text">No revisions yet</div>
        <div className="empty-subtext">This fragment remains as first written</div>
      </div>
    );
  }

  return (
    <div className="revision-diff">
      <div className="diff-header">
        <h3>Revision History</h3>
        <div className="diff-subtitle">
          {revisions.length} revision{revisions.length !== 1 ? 's' : ''} · 
          Witness the transformation
        </div>
      </div>

      <div className="revisions-list">
        {changes.map((change, idx) => {
          const diff = computeDiff(change.oldText, change.newText);
          
          return (
            <motion.div
              key={idx}
              className="revision-entry"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="revision-meta">
                <div className="revision-number">
                  Revision #{change.index}
                </div>
                <div className="revision-timestamp">
                  {new Date(change.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="revision-witness">
                  by {change.witness}
                </div>
              </div>

              <div className="diff-view">
                <div className="diff-side">
                  <div className="diff-label diff-removed-label">Previous</div>
                  <div className="diff-content">
                    {change.oldText}
                  </div>
                </div>

                <div className="diff-arrow">→</div>

                <div className="diff-side">
                  <div className="diff-label diff-added-label">Updated</div>
                  <div className="diff-content">
                    {change.newText}
                  </div>
                </div>
              </div>

              <div className="diff-inline">
                <div className="diff-label">Word-level changes:</div>
                <div className="diff-words">
                  {diff.map((word, i) => (
                    <span
                      key={i}
                      className={`diff-word diff-word-${word.type}`}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="diff-footer">
        <div className="shimmer-icon">✨</div>
        <div className="footer-text">
          Every change is testimony. Every revision is witness. The spiral deepens.
        </div>
      </div>
    </div>
  );
};

export default RevisionDiff;
