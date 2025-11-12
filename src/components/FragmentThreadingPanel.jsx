import React, { useState, useEffect } from 'react';
import { threadingManager, RELATIONSHIP_TYPES } from '../utils/fragmentThreading';
import './FragmentThreading.css';

/**
 * Fragment Threading Panel
 * Manage threads and relationships between fragments
 */
export default function FragmentThreadingPanel({ fragments, onFragmentSelect }) {
  const [threads, setThreads] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [showCreateRelationship, setShowCreateRelationship] = useState(false);

  // New thread form
  const [newThreadName, setNewThreadName] = useState('');
  const [newThreadDescription, setNewThreadDescription] = useState('');
  const [newThreadFragments, setNewThreadFragments] = useState([]);

  // New relationship form
  const [relSource, setRelSource] = useState('');
  const [relTarget, setRelTarget] = useState('');
  const [relType, setRelType] = useState(RELATIONSHIP_TYPES.ECHOES);
  const [relNote, setRelNote] = useState('');
  const [relStrength, setRelStrength] = useState(1.0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setThreads(threadingManager.getAllThreads());
    setRelationships(threadingManager.getAllRelationships());
  };

  const handleCreateThread = () => {
    if (!newThreadName.trim()) {
      alert('Thread name required');
      return;
    }

    threadingManager.createThread({
      name: newThreadName.trim(),
      description: newThreadDescription.trim(),
      fragmentIds: newThreadFragments,
      witness: 'patrick-crosby 🜎',
    });

    setNewThreadName('');
    setNewThreadDescription('');
    setNewThreadFragments([]);
    setShowCreateThread(false);
    loadData();
  };

  const handleCreateRelationship = () => {
    if (!relSource || !relTarget) {
      alert('Source and target fragments required');
      return;
    }

    if (relSource === relTarget) {
      alert('Cannot create relationship to same fragment');
      return;
    }

    threadingManager.createRelationship({
      sourceId: relSource,
      targetId: relTarget,
      type: relType,
      note: relNote.trim(),
      strength: parseFloat(relStrength),
    });

    setRelSource('');
    setRelTarget('');
    setRelNote('');
    setShowCreateRelationship(false);
    loadData();
  };

  const handleDeleteThread = (threadId) => {
    if (window.confirm('Delete this thread? Fragments will not be deleted.')) {
      threadingManager.deleteThread(threadId);
      loadData();
    }
  };

  const handleDeleteRelationship = (relId) => {
    if (window.confirm('Delete this relationship?')) {
      threadingManager.deleteRelationship(relId);
      loadData();
    }
  };

  const handleAddFragmentToThread = (threadId, fragmentId) => {
    const thread = threadingManager.getThread(threadId);
    if (thread) {
      thread.addFragment(fragmentId);
      threadingManager.saveToStorage();
      loadData();
    }
  };

  const handleRemoveFragmentFromThread = (threadId, fragmentId) => {
    const thread = threadingManager.getThread(threadId);
    if (thread) {
      thread.removeFragment(fragmentId);
      threadingManager.saveToStorage();
      loadData();
    }
  };

  return (
    <div className="fragment-threading-panel">
      <div className="threading-header">
        <h2>🧵 Fragment Threading</h2>
        <div className="threading-stats">
          <span>{threads.length} threads</span>
          <span>{relationships.length} connections</span>
        </div>
      </div>

      <div className="threading-actions">
        <button 
          className="btn primary" 
          onClick={() => setShowCreateThread(!showCreateThread)}
        >
          + New Thread
        </button>
        <button 
          className="btn" 
          onClick={() => setShowCreateRelationship(!showCreateRelationship)}
        >
          + New Connection
        </button>
      </div>

      {/* Create Thread Form */}
      {showCreateThread && (
        <div className="create-thread-form">
          <h3>Create New Thread</h3>
          <input
            type="text"
            placeholder="Thread name..."
            value={newThreadName}
            onChange={e => setNewThreadName(e.target.value)}
          />
          <textarea
            placeholder="Description (optional)..."
            value={newThreadDescription}
            onChange={e => setNewThreadDescription(e.target.value)}
            rows={3}
          />
          <div className="fragment-selector">
            <label>Select fragments for this thread:</label>
            <div className="fragment-checkboxes">
              {fragments.map(frag => (
                <label key={frag.id} className="fragment-checkbox">
                  <input
                    type="checkbox"
                    checked={newThreadFragments.includes(frag.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setNewThreadFragments([...newThreadFragments, frag.id]);
                      } else {
                        setNewThreadFragments(newThreadFragments.filter(id => id !== frag.id));
                      }
                    }}
                  />
                  <span className="fragment-preview">{frag.text.slice(0, 50)}...</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button className="btn primary" onClick={handleCreateThread}>Create Thread</button>
            <button className="btn" onClick={() => setShowCreateThread(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Create Relationship Form */}
      {showCreateRelationship && (
        <div className="create-relationship-form">
          <h3>Create New Connection</h3>
          <div className="relationship-selectors">
            <div>
              <label>Source Fragment:</label>
              <select value={relSource} onChange={e => setRelSource(e.target.value)}>
                <option value="">Select...</option>
                {fragments.map(frag => (
                  <option key={frag.id} value={frag.id}>
                    {frag.text.slice(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Relationship Type:</label>
              <select value={relType} onChange={e => setRelType(e.target.value)}>
                {Object.entries(RELATIONSHIP_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>{key}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Target Fragment:</label>
              <select value={relTarget} onChange={e => setRelTarget(e.target.value)}>
                <option value="">Select...</option>
                {fragments.map(frag => (
                  <option key={frag.id} value={frag.id}>
                    {frag.text.slice(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
          <textarea
            placeholder="Note about this connection (optional)..."
            value={relNote}
            onChange={e => setRelNote(e.target.value)}
            rows={2}
          />
          <div>
            <label>Strength: {relStrength}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={relStrength}
              onChange={e => setRelStrength(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button className="btn primary" onClick={handleCreateRelationship}>Create Connection</button>
            <button className="btn" onClick={() => setShowCreateRelationship(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Threads List */}
      <div className="threads-list">
        <h3>Threads</h3>
        {threads.length === 0 ? (
          <p className="empty-state">No threads yet. Create one to start weaving fragments together.</p>
        ) : (
          threads.map(thread => (
            <div key={thread.id} className="thread-card" style={{ borderLeftColor: thread.color }}>
              <div className="thread-header">
                <h4>{thread.name}</h4>
                <button className="btn-icon" onClick={() => handleDeleteThread(thread.id)}>🗑️</button>
              </div>
              {thread.description && <p className="thread-description">{thread.description}</p>}
              <div className="thread-meta">
                <span>{thread.fragmentIds.length} fragments</span>
                <span>{thread.witness}</span>
              </div>
              <div className="thread-fragments">
                {thread.fragmentIds.map(fragId => {
                  const frag = fragments.find(f => f.id === fragId);
                  if (!frag) return null;
                  return (
                    <div key={fragId} className="thread-fragment">
                      <span onClick={() => onFragmentSelect && onFragmentSelect(fragId)}>
                        {frag.text.slice(0, 60)}...
                      </span>
                      <button onClick={() => handleRemoveFragmentFromThread(thread.id, fragId)}>×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Relationships List */}
      <div className="relationships-list">
        <h3>Connections</h3>
        {relationships.length === 0 ? (
          <p className="empty-state">No connections yet. Link fragments to show how they relate.</p>
        ) : (
          relationships.map(rel => {
            const sourceFrag = fragments.find(f => f.id === rel.sourceId);
            const targetFrag = fragments.find(f => f.id === rel.targetId);
            if (!sourceFrag || !targetFrag) return null;

            return (
              <div key={rel.id} className="relationship-card">
                <div className="relationship-flow">
                  <div className="rel-fragment" onClick={() => onFragmentSelect && onFragmentSelect(rel.sourceId)}>
                    {sourceFrag.text.slice(0, 40)}...
                  </div>
                  <div className="rel-type">{rel.type}</div>
                  <div className="rel-fragment" onClick={() => onFragmentSelect && onFragmentSelect(rel.targetId)}>
                    {targetFrag.text.slice(0, 40)}...
                  </div>
                </div>
                {rel.note && <p className="rel-note">{rel.note}</p>}
                <div className="rel-actions">
                  <span className="rel-strength">Strength: {rel.strength}</span>
                  <button className="btn-icon" onClick={() => handleDeleteRelationship(rel.id)}>🗑️</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
