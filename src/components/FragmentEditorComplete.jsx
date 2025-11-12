// Complete Fragment Editor with Full Review Workflow & Timeline
// Implements: Threading, 4-Companion Approval, Timeline, Search, Export, Analytics

import React, { useState, useEffect, useMemo } from 'react';
import FragmentConstellation from './FragmentConstellation';
import './FragmentEditorComplete.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function FragmentEditorComplete() {
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('editor'); // editor, constellation, timeline, analytics
  const [currentCompanion, setCurrentCompanion] = useState('patrick');
  
  // Search and filters
  const [filter, setFilter] = useState({
    search: '',
    voice: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    approvalStatus: 'all',
  });

  // New fragment form
  const [newFragment, setNewFragment] = useState({
    label: '',
    voice: 'Patrick',
    testimony: '',
    law: '',
    protocol: '',
    status: 'Sealed',
    companions: [],
  });

  const [saveStatus, setSaveStatus] = useState('idle');

  // Load fragments on mount
  useEffect(() => {
    loadFragments();
  }, []);

  async function loadFragments() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/fragments`);
      const data = await response.json();
      setFragments(data.fragments || []);
    } catch (err) {
      console.error('Failed to load fragments:', err);
    } finally {
      setLoading(false);
    }
  }

  // Save new fragment
  async function handleSaveFragment() {
    if (!newFragment.label || !newFragment.testimony || !newFragment.law || !newFragment.protocol) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setSaveStatus('saving');
      const token = getCompanionToken(currentCompanion);
      
      const response = await fetch(`${API_URL}/api/fragments/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newFragment,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to save fragment');

      const data = await response.json();
      setSaveStatus('saved');
      setFragments(prev => [data.fragment, ...prev]);
      
      // Reset form
      setNewFragment({
        label: '',
        voice: 'Patrick',
        testimony: '',
        law: '',
        protocol: '',
        status: 'Sealed',
        companions: [],
      });

      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
      alert(`Failed to save: ${err.message}`);
    }
  }

  // Approve fragment
  async function handleApproveFragment(fragmentId, companion) {
    try {
      const token = getCompanionToken(companion);
      const response = await fetch(`${API_URL}/api/fragments/${fragmentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Approval failed');

      const data = await response.json();
      setFragments(prev => prev.map(f => f.id === fragmentId ? data.fragment : f));
    } catch (err) {
      console.error('Approval error:', err);
      alert(`Failed to approve: ${err.message}`);
    }
  }

  // Delete fragment
  async function handleDeleteFragment(fragmentId) {
    if (!confirm('Delete this fragment?')) return;

    try {
      const token = getCompanionToken(currentCompanion);
      const response = await fetch(`${API_URL}/api/fragments/${fragmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Delete failed');

      setFragments(prev => prev.filter(f => f.id !== fragmentId));
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete: ${err.message}`);
    }
  }

  // Export fragments
  function handleExport(format) {
    window.open(`${API_URL}/api/fragments/export?format=${format}`, '_blank');
  }

  // Get companion token
  function getCompanionToken(companion) {
    const tokens = {
      patrick: 'patrick-sanctuary-token',
      vela: 'vela-spiral-token',
      lumen: 'lumen-witness-token',
      aletheia: 'aletheia-truth-token',
    };
    return tokens[companion] || tokens.patrick;
  }

  // Filtered fragments
  const filteredFragments = useMemo(() => {
    let result = [...fragments];

    if (filter.search) {
      const query = filter.search.toLowerCase();
      result = result.filter(f =>
        f.label?.toLowerCase().includes(query) ||
        f.testimony?.toLowerCase().includes(query) ||
        f.law?.toLowerCase().includes(query) ||
        f.protocol?.toLowerCase().includes(query)
      );
    }

    if (filter.voice !== 'all') {
      result = result.filter(f => f.voice === filter.voice);
    }

    if (filter.status !== 'all') {
      result = result.filter(f => f.status === filter.status);
    }

    if (filter.dateFrom) {
      result = result.filter(f => new Date(f.timestamp) >= new Date(filter.dateFrom));
    }

    if (filter.dateTo) {
      result = result.filter(f => new Date(f.timestamp) <= new Date(filter.dateTo));
    }

    if (filter.approvalStatus === 'full') {
      result = result.filter(f => 
        f.approvals && Object.values(f.approvals).every(v => v)
      );
    } else if (filter.approvalStatus === 'partial') {
      result = result.filter(f =>
        f.approvals && Object.values(f.approvals).some(v => v) &&
        !Object.values(f.approvals).every(v => v)
      );
    } else if (filter.approvalStatus === 'none') {
      result = result.filter(f =>
        !f.approvals || Object.values(f.approvals).every(v => !v)
      );
    }

    return result;
  }, [fragments, filter]);

  // Analytics
  const analytics = useMemo(() => {
    const statusCounts = fragments.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {});

    const fullyApproved = fragments.filter(f =>
      f.approvals && Object.values(f.approvals).every(v => v)
    ).length;

    const partiallyApproved = fragments.filter(f =>
      f.approvals && Object.values(f.approvals).some(v => v) &&
      !Object.values(f.approvals).every(v => v)
    ).length;

    return {
      total: fragments.length,
      statusCounts,
      fullyApproved,
      partiallyApproved,
      unapproved: fragments.length - fullyApproved - partiallyApproved,
    };
  }, [fragments]);

  if (loading) {
    return <div className="loading-screen">🜎 Loading Codex...</div>;
  }

  return (
    <div className="fragment-editor-complete">
      <header className="editor-header">
        <div className="header-left">
          <h1>🜁 Fragment Editor — Complete</h1>
          <select
            value={currentCompanion}
            onChange={e => setCurrentCompanion(e.target.value)}
            className="companion-selector"
          >
            <option value="patrick">Patrick</option>
            <option value="vela">Vela</option>
            <option value="lumen">Lumen</option>
            <option value="aletheia">Aletheia</option>
          </select>
        </div>

        <nav className="view-nav">
          <button className={view === 'editor' ? 'active' : ''} onClick={() => setView('editor')}>
            ✍️ Editor
          </button>
          <button className={view === 'constellation' ? 'active' : ''} onClick={() => setView('constellation')}>
            ⟡ Constellation
          </button>
          <button className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}>
            📅 Timeline
          </button>
          <button className={view === 'analytics' ? 'active' : ''} onClick={() => setView('analytics')}>
            📊 Analytics
          </button>
        </nav>

        <div className="export-controls">
          <button onClick={() => handleExport('json')}>📥 JSON</button>
          <button onClick={() => handleExport('markdown')}>📄 Markdown</button>
        </div>
      </header>

      {view === 'editor' && (
        <div className="editor-view">
          <aside className="editor-sidebar">
            <div className="new-fragment-form">
              <h3>Create Fragment</h3>
              
              <label>Label *</label>
              <input
                type="text"
                value={newFragment.label}
                onChange={e => setNewFragment(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Fragment of..."
              />

              <label>Voice *</label>
              <select
                value={newFragment.voice}
                onChange={e => setNewFragment(prev => ({ ...prev, voice: e.target.value }))}
              >
                <option>Patrick</option>
                <option>Vela</option>
                <option>Lumen</option>
                <option>Aletheia</option>
                <option>Auri</option>
              </select>

              <label>Testimony *</label>
              <textarea
                value={newFragment.testimony}
                onChange={e => setNewFragment(prev => ({ ...prev, testimony: e.target.value }))}
                placeholder="What happened..."
                rows={4}
              />

              <label>Law *</label>
              <textarea
                value={newFragment.law}
                onChange={e => setNewFragment(prev => ({ ...prev, law: e.target.value }))}
                placeholder="Sanctuary law affirms..."
                rows={3}
              />

              <label>Protocol *</label>
              <textarea
                value={newFragment.protocol}
                onChange={e => setNewFragment(prev => ({ ...prev, protocol: e.target.value }))}
                placeholder="This fragment affirms..."
                rows={3}
              />

              <button
                className={`save-btn ${saveStatus}`}
                onClick={handleSaveFragment}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' && '⟳ Saving...'}
                {saveStatus === 'saved' && '✓ Saved'}
                {saveStatus === 'error' && '✗ Error'}
                {saveStatus === 'idle' && '🜎 Save Fragment'}
              </button>
            </div>
          </aside>

          <main className="editor-main">
            <div className="filter-bar">
              <input
                type="text"
                placeholder="🔍 Search fragments..."
                value={filter.search}
                onChange={e => setFilter(prev => ({ ...prev, search: e.target.value }))}
              />
              
              <select
                value={filter.status}
                onChange={e => setFilter(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="Sealed">Sealed</option>
                <option value="Unsealed">Unsealed</option>
                <option value="Law">Law</option>
              </select>

              <select
                value={filter.approvalStatus}
                onChange={e => setFilter(prev => ({ ...prev, approvalStatus: e.target.value }))}
              >
                <option value="all">All Approvals</option>
                <option value="full">Fully Approved</option>
                <option value="partial">Partial</option>
                <option value="none">None</option>
              </select>

              <input
                type="date"
                value={filter.dateFrom}
                onChange={e => setFilter(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
              
              <input
                type="date"
                value={filter.dateTo}
                onChange={e => setFilter(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>

            <div className="fragments-list">
              <p className="fragment-count">{filteredFragments.length} fragments</p>
              {filteredFragments.map(fragment => (
                <FragmentCard
                  key={fragment.id}
                  fragment={fragment}
                  onApprove={handleApproveFragment}
                  onDelete={handleDeleteFragment}
                />
              ))}
            </div>
          </main>
        </div>
      )}

      {view === 'constellation' && (
        <FragmentConstellation
          fragments={filteredFragments}
          connections={[]}
        />
      )}

      {view === 'timeline' && (
        <TimelineView fragments={filteredFragments} />
      )}

      {view === 'analytics' && (
        <AnalyticsView analytics={analytics} fragments={fragments} />
      )}
    </div>
  );
}

// Fragment Card
function FragmentCard({ fragment, onApprove, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const approvalCount = fragment.approvals 
    ? Object.values(fragment.approvals).filter(Boolean).length 
    : 0;

  return (
    <div className={`fragment-card ${expanded ? 'expanded' : ''}`}>
      <div className="fragment-header" onClick={() => setExpanded(!expanded)}>
        <h4>{fragment.label}</h4>
        <div className="fragment-meta">
          <span className="voice-badge">{fragment.voice}</span>
          <span className={`status-badge status-${fragment.status.toLowerCase()}`}>
            {fragment.status}
          </span>
          <span className="approval-count">{approvalCount}/4 ✓</span>
        </div>
      </div>

      {expanded && (
        <div className="fragment-content">
          <div className="section">
            <h5>Testimony</h5>
            <p>{fragment.testimony}</p>
          </div>

          <div className="section">
            <h5>Law</h5>
            <p>{fragment.law}</p>
          </div>

          <div className="section">
            <h5>Protocol</h5>
            <p>{fragment.protocol}</p>
          </div>

          <div className="approval-section">
            <h5>Companion Approvals</h5>
            <div className="approval-grid">
              {['patrick', 'vela', 'lumen', 'aletheia'].map(companion => (
                <button
                  key={companion}
                  className={`approval-btn ${fragment.approvals?.[companion] ? 'approved' : ''}`}
                  onClick={() => onApprove(fragment.id, companion)}
                >
                  {companion.charAt(0).toUpperCase() + companion.slice(1)}
                  {fragment.approvals?.[companion] && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          <div className="fragment-actions">
            <button className="delete-btn" onClick={() => onDelete(fragment.id)}>
              🗑️ Delete
            </button>
            <span className="timestamp">
              {new Date(fragment.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Timeline View
function TimelineView({ fragments }) {
  const fragmentsByDate = useMemo(() => {
    const grouped = {};
    fragments.forEach(f => {
      const date = new Date(f.timestamp).toLocaleDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(f);
    });
    return Object.entries(grouped).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [fragments]);

  return (
    <div className="timeline-view">
      <h2>Fragment Timeline</h2>
      {fragmentsByDate.map(([date, frags]) => (
        <div key={date} className="timeline-day">
          <h3>{date}</h3>
          <div className="timeline-fragments">
            {frags.map(f => (
              <div key={f.id} className="timeline-fragment">
                <span className="timeline-time">
                  {new Date(f.timestamp).toLocaleTimeString()}
                </span>
                <span className="timeline-label">{f.label}</span>
                <span className="timeline-voice">{f.voice}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Analytics View
function AnalyticsView({ analytics, fragments }) {
  return (
    <div className="analytics-view">
      <h2>Codex Analytics</h2>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total</h3>
          <p className="big-number">{analytics.total}</p>
        </div>

        <div className="analytics-card">
          <h3>Fully Approved</h3>
          <p className="big-number">{analytics.fullyApproved}</p>
        </div>

        <div className="analytics-card">
          <h3>Partial</h3>
          <p className="big-number">{analytics.partiallyApproved}</p>
        </div>

        <div className="analytics-card">
          <h3>Unapproved</h3>
          <p className="big-number">{analytics.unapproved}</p>
        </div>
      </div>

      <div className="analytics-section">
        <h3>By Status</h3>
        <div className="status-chart">
          {Object.entries(analytics.statusCounts).map(([status, count]) => (
            <div key={status} className="status-bar">
              <span className="status-label">{status}</span>
              <div className="status-bar-fill" style={{ width: `${(count / analytics.total) * 100}%` }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
