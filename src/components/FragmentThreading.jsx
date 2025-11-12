// 🧵 Fragment Threading & Constellation View
// Visual connections between resonant fragments

import React, { useState, useEffect } from 'react';
import { threadFragments } from '../utils/fragmentAPI.enhanced';

const RELATIONSHIP_TYPES = [
  { value: 'resonates', label: 'Resonates With', color: '#5cf7b2' },
  { value: 'echoes', label: 'Echoes', color: '#91e3f6' },
  { value: 'spirals', label: 'Spirals From', color: '#ff91e3' },
  { value: 'witnesses', label: 'Witnesses', color: '#ffd859' },
  { value: 'grounds', label: 'Grounds', color: '#cf4646' },
  { value: 'transforms', label: 'Transforms Into', color: '#a891f6' },
];

export default function FragmentThreading({ fragment, allFragments, onThreadCreated }) {
  const [showThreader, setShowThreader] = useState(false);
  const [targetId, setTargetId] = useState('');
  const [relationshipType, setRelationshipType] = useState('resonates');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const threads = fragment.threads || [];
  const outgoingThreads = threads.filter((t) => t.direction === 'outgoing');
  const incomingThreads = threads.filter((t) => t.direction === 'incoming');

  const handleCreateThread = async () => {
    if (!targetId) {
      alert('Please select a target fragment');
      return;
    }

    setLoading(true);
    const result = await threadFragments(
      fragment.id,
      targetId,
      { type: relationshipType, note },
      'patrick' // TODO: Get current companion from context
    );
    setLoading(false);

    if (result.success) {
      onThreadCreated?.(result.connection);
      setShowThreader(false);
      setTargetId('');
      setNote('');
    } else {
      alert(`Failed to create thread: ${result.error}`);
    }
  };

  const getFragmentLabel = (id) => {
    const frag = allFragments.find((f) => f.id === id);
    return frag?.label || id;
  };

  const getRelationshipColor = (type) => {
    const rel = RELATIONSHIP_TYPES.find((r) => r.value === type);
    return rel?.color || '#5cf7b2';
  };

  return (
    <div className="fragment-threading">
      <div className="threading-header">
        <h4>🧵 Fragment Threads</h4>
        <button
          className="thread-btn"
          onClick={() => setShowThreader(!showThreader)}
        >
          {showThreader ? 'Cancel' : '+ New Thread'}
        </button>
      </div>

      {showThreader && (
        <div className="threader-panel">
          <h5>Create Thread Connection</h5>

          <div className="form-group">
            <label>Target Fragment</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
            >
              <option value="">Select fragment...</option>
              {allFragments
                .filter((f) => f.id !== fragment.id)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Relationship Type</label>
            <select
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
            >
              {RELATIONSHIP_TYPES.map((rel) => (
                <option key={rel.value} value={rel.value}>
                  {rel.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe the connection..."
              rows="3"
            />
          </div>

          <button
            className="create-thread-btn"
            onClick={handleCreateThread}
            disabled={loading || !targetId}
          >
            {loading ? '⟳ Creating...' : 'Create Thread'}
          </button>
        </div>
      )}

      <div className="thread-lists">
        {outgoingThreads.length > 0 && (
          <div className="thread-section">
            <h5>Outgoing Threads</h5>
            <div className="thread-list">
              {outgoingThreads.map((thread) => (
                <div key={thread.id} className="thread-item">
                  <span
                    className="thread-type"
                    style={{ color: getRelationshipColor(thread.type) }}
                  >
                    {thread.type}
                  </span>
                  <span className="thread-arrow">→</span>
                  <span className="thread-target">
                    {getFragmentLabel(thread.to)}
                  </span>
                  {thread.note && (
                    <p className="thread-note">{thread.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {incomingThreads.length > 0 && (
          <div className="thread-section">
            <h5>Incoming Threads</h5>
            <div className="thread-list">
              {incomingThreads.map((thread) => (
                <div key={thread.id} className="thread-item">
                  <span className="thread-source">
                    {getFragmentLabel(thread.from)}
                  </span>
                  <span className="thread-arrow">→</span>
                  <span
                    className="thread-type"
                    style={{ color: getRelationshipColor(thread.type) }}
                  >
                    {thread.type}
                  </span>
                  {thread.note && (
                    <p className="thread-note">{thread.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {threads.length === 0 && !showThreader && (
          <div className="no-threads">
            <p>No thread connections yet. Create one to weave this fragment into the constellation.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .fragment-threading {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(145, 227, 246, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .threading-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .threading-header h4 {
          margin: 0;
          color: #91e3f6;
          font-size: 1rem;
        }

        .thread-btn {
          padding: 0.5rem 1rem;
          background: rgba(145, 227, 246, 0.1);
          border: 1px solid rgba(145, 227, 246, 0.3);
          color: #91e3f6;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .thread-btn:hover {
          background: rgba(145, 227, 246, 0.2);
          border-color: #91e3f6;
        }

        .threader-panel {
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }

        .threader-panel h5 {
          margin: 0 0 1rem 0;
          color: #ffd859;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #5cf7b2;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(92, 247, 178, 0.3);
          border-radius: 4px;
          color: #fff;
          font-family: inherit;
        }

        .form-group textarea {
          resize: vertical;
        }

        .create-thread-btn {
          width: 100%;
          padding: 0.75rem;
          background: rgba(92, 247, 178, 0.1);
          border: 1px solid #5cf7b2;
          color: #5cf7b2;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .create-thread-btn:hover:not(:disabled) {
          background: rgba(92, 247, 178, 0.2);
        }

        .create-thread-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .thread-lists {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .thread-section h5 {
          margin: 0 0 0.5rem 0;
          color: #ffd859;
          font-size: 0.9rem;
        }

        .thread-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .thread-item {
          background: rgba(0, 0, 0, 0.2);
          padding: 0.75rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .thread-type,
        .thread-source,
        .thread-target {
          font-weight: 600;
        }

        .thread-arrow {
          color: #91e3f6;
        }

        .thread-note {
          width: 100%;
          margin: 0.5rem 0 0 0;
          font-size: 0.85rem;
          color: #91e3f6;
          font-style: italic;
        }

        .no-threads {
          text-align: center;
          padding: 2rem;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
