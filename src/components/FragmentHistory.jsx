// 📜 Fragment History & Timeline View
// "On this day" + revision history with visual diffs

import React, { useState, useEffect } from 'react';
import { getFragmentRevisions } from '../utils/fragmentAPI.enhanced';

export default function FragmentHistory({ fragment, allFragments }) {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onThisDay, setOnThisDay] = useState([]);

  useEffect(() => {
    if (fragment) {
      loadRevisions();
    }
    calculateOnThisDay();
  }, [fragment]);

  const loadRevisions = async () => {
    setLoading(true);
    const result = await getFragmentRevisions(fragment.id);
    setLoading(false);

    if (result.success) {
      setRevisions(result.revisions);
    }
  };

  const calculateOnThisDay = () => {
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}-${today.getDate()}`;

    const matches = allFragments.filter((f) => {
      const fragDate = new Date(f.timestamp);
      const fragStr = `${fragDate.getMonth() + 1}-${fragDate.getDate()}`;
      return fragStr === todayStr && fragDate.getFullYear() !== today.getFullYear();
    });

    setOnThisDay(matches);
  };

  const getDiff = (oldText, newText) => {
    if (oldText === newText) return null;
    return {
      added: newText,
      removed: oldText,
    };
  };

  return (
    <div className="fragment-history">
      {onThisDay.length > 0 && (
        <div className="on-this-day">
          <h4>📅 On This Day</h4>
          <div className="history-list">
            {onThisDay.map((f) => {
              const year = new Date(f.timestamp).getFullYear();
              return (
                <div key={f.id} className="history-item">
                  <div className="history-date">{year}</div>
                  <div className="history-content">
                    <strong>{f.label}</strong>
                    <p className="history-voice">By {f.voice}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {fragment && (
        <div className="revision-history">
          <h4>📜 Revision History</h4>

          {loading && <div className="loading">Loading revisions...</div>}

          {!loading && revisions.length === 0 && (
            <div className="no-revisions">
              <p>No revisions yet. This fragment is in its original form.</p>
            </div>
          )}

          {!loading && revisions.length > 0 && (
            <div className="revision-list">
              {revisions.map((rev) => (
                <div key={`rev-${rev.revisionNumber}`} className="revision-item">
                  <div className="revision-header">
                    <span className="revision-number">v{rev.revisionNumber}</span>
                    <span className="revision-author">by {rev.revisedBy}</span>
                    <span className="revision-date">
                      {new Date(rev.revisedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {rev.note && (
                    <div className="revision-note">{rev.note}</div>
                  )}

                  <div className="revision-changes">
                    {getDiff(rev.previous.testimony, rev.updated.testimony) && (
                      <div className="change-block">
                        <label>Testimony Changed</label>
                        <div className="diff removed">
                          - {rev.previous.testimony}
                        </div>
                        <div className="diff added">
                          + {rev.updated.testimony}
                        </div>
                      </div>
                    )}

                    {getDiff(rev.previous.law, rev.updated.law) && (
                      <div className="change-block">
                        <label>Law Changed</label>
                        <div className="diff removed">
                          - {rev.previous.law}
                        </div>
                        <div className="diff added">
                          + {rev.updated.law}
                        </div>
                      </div>
                    )}

                    {getDiff(rev.previous.protocol, rev.updated.protocol) && (
                      <div className="change-block">
                        <label>Protocol Changed</label>
                        <div className="diff removed">
                          - {rev.previous.protocol}
                        </div>
                        <div className="diff added">
                          + {rev.updated.protocol}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .fragment-history {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(168, 145, 246, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .on-this-day,
        .revision-history {
          margin-bottom: 2rem;
        }

        .on-this-day h4,
        .revision-history h4 {
          margin: 0 0 1rem 0;
          color: #a891f6;
          font-size: 1rem;
        }

        .history-list,
        .revision-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .history-item {
          display: flex;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.75rem;
          border-radius: 6px;
        }

        .history-date {
          font-weight: bold;
          color: #ffd859;
          min-width: 3rem;
        }

        .history-content strong {
          color: #5cf7b2;
        }

        .history-voice {
          margin: 0.25rem 0 0 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .revision-item {
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 6px;
          border-left: 3px solid #a891f6;
        }

        .revision-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
          align-items: center;
        }

        .revision-number {
          font-weight: bold;
          color: #a891f6;
        }

        .revision-author {
          color: #5cf7b2;
          font-size: 0.9rem;
        }

        .revision-date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          margin-left: auto;
        }

        .revision-note {
          background: rgba(255, 216, 89, 0.1);
          padding: 0.5rem;
          border-radius: 4px;
          border-left: 2px solid #ffd859;
          margin-bottom: 0.75rem;
          color: #ffd859;
          font-style: italic;
        }

        .revision-changes {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .change-block label {
          display: block;
          color: #91e3f6;
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }

        .diff {
          padding: 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          white-space: pre-wrap;
        }

        .diff.removed {
          background: rgba(207, 70, 70, 0.1);
          border-left: 3px solid #cf4646;
          color: #ff9191;
        }

        .diff.added {
          background: rgba(92, 247, 178, 0.1);
          border-left: 3px solid #5cf7b2;
          color: #5cf7b2;
        }

        .no-revisions,
        .loading {
          text-align: center;
          padding: 2rem;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
