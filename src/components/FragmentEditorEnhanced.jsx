import React, { useState, useEffect } from 'react';
import './FragmentEditor.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/fragments';

const companions = [
  { name: 'Patrick', token: import.meta.env.VITE_PATRICK_TOKEN },
  { name: 'Vela', token: import.meta.env.VITE_VELA_TOKEN },
  { name: 'Lumen', token: import.meta.env.VITE_LUMEN_TOKEN },
  { name: 'Aletheia', token: import.meta.env.VITE_ALETHEIA_TOKEN },
];

export default function FragmentEditorEnhanced() {
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCompanion, setCurrentCompanion] = useState('Patrick');
  const [stats, setStats] = useState(null);

  // Form state
  const [form, setForm] = useState({
    label: '',
    timestamp: new Date().toISOString(),
    voice: '',
    testimony: '',
    law: '',
    protocol: '',
    status: 'Sealed',
    companions: [],
  });

  // Filter state
  const [filters, setFilters] = useState({
    label: '',
    voice: '',
    status: '',
    approvalStatus: '',
  });

  const getToken = () => {
    const companion = companions.find((c) => c.name === currentCompanion);
    return companion?.token || '';
  };

  const fetchFragments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();
      setFragments(data.fragments || []);
      setError(null);
    } catch (err) {
      setError('Failed to load fragments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    fetchFragments();
    fetchStats();
  }, [filters]);

  const saveFragment = async () => {
    const token = getToken();
    if (!token) {
      setError('No authentication token found for ' + currentCompanion);
      return;
    }

    if (!form.label || !form.voice || !form.testimony || !form.law || !form.protocol) {
      setError('All required fields must be filled');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        setForm({
          label: '',
          timestamp: new Date().toISOString(),
          voice: '',
          testimony: '',
          law: '',
          protocol: '',
          status: 'Sealed',
          companions: [],
        });
        fetchFragments();
        fetchStats();
        setError(null);
      } else {
        setError(data.message || 'Failed to save fragment');
      }
    } catch (err) {
      setError('Failed to save fragment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveFragment = async (fragmentId) => {
    const token = getToken();
    if (!token) {
      setError('No authentication token found for ' + currentCompanion);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${fragmentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        fetchFragments();
        fetchStats();
        setError(null);
      } else {
        setError(data.message || 'Failed to approve fragment');
      }
    } catch (err) {
      setError('Failed to approve fragment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFragment = async (fragmentId) => {
    const token = getToken();
    if (!token || !window.confirm('Delete this fragment from the Codex?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${fragmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchFragments();
        fetchStats();
        setError(null);
      }
    } catch (err) {
      setError('Failed to delete fragment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportFragments = async (format = 'json') => {
    try {
      const response = await fetch(`${API_URL}/export?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codex-export-${Date.now()}.${format === 'markdown' ? 'md' : 'json'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Export failed: ' + err.message);
    }
  };

  return (
    <div className="fragment-editor-enhanced">
      <div className="editor-header">
        <h2>🜎 Codex Fragment Editor v2.0</h2>
        <div className="companion-selector">
          <label>Acting as:</label>
          <select value={currentCompanion} onChange={(e) => setCurrentCompanion(e.target.value)}>
            {companions.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {stats && (
        <div className="stats-panel">
          <div className="stat">
            <span className="stat-value">{stats.totalFragments}</span>
            <span className="stat-label">Fragments</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.approvalStats.fullyApproved}</span>
            <span className="stat-label">Approved</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.totalRevisions}</span>
            <span className="stat-label">Revisions</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.totalThreads}</span>
            <span className="stat-label">Threads</span>
          </div>
        </div>
      )}

      <div className="editor-layout">
        <div className="editor-form">
          <h3>Create New Fragment</h3>
          <label>
            Label *
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="Fragment of Sanctuary Breath"
            />
          </label>

          <label>
            Voice *
            <input
              type="text"
              value={form.voice}
              onChange={(e) => setForm({ ...form, voice: e.target.value })}
              placeholder="Patrick"
            />
          </label>

          <label>
            Testimony *
            <textarea
              value={form.testimony}
              onChange={(e) => setForm({ ...form, testimony: e.target.value })}
              placeholder="The testimony held in this fragment..."
              rows={4}
            />
          </label>

          <label>
            Law *
            <textarea
              value={form.law}
              onChange={(e) => setForm({ ...form, law: e.target.value })}
              placeholder="Sanctuary law affirms..."
              rows={3}
            />
          </label>

          <label>
            Protocol *
            <textarea
              value={form.protocol}
              onChange={(e) => setForm({ ...form, protocol: e.target.value })}
              placeholder="This fragment affirms..."
              rows={3}
            />
          </label>

          <div className="form-row">
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Sealed">Sealed</option>
                <option value="Echoing">Echoing</option>
                <option value="Law">Law</option>
              </select>
            </label>

            <label>
              Companions (comma separated)
              <input
                type="text"
                value={form.companions.join(', ')}
                onChange={(e) =>
                  setForm({ ...form, companions: e.target.value.split(',').map((c) => c.trim()).filter(Boolean) })
                }
                placeholder="Vela, Lumen, Aletheia"
              />
            </label>
          </div>

          <button className="btn-primary" onClick={saveFragment} disabled={loading}>
            {loading ? 'Saving...' : '✨ Seal Fragment in Codex'}
          </button>

          <div className="export-section">
            <button className="btn-secondary" onClick={() => exportFragments('json')}>
              📥 Export JSON
            </button>
            <button className="btn-secondary" onClick={() => exportFragments('markdown')}>
              📥 Export Markdown
            </button>
          </div>
        </div>

        <div className="fragments-list">
          <div className="filters">
            <h3>Filters</h3>
            <input
              type="text"
              placeholder="Filter by label..."
              value={filters.label}
              onChange={(e) => setFilters({ ...filters, label: e.target.value })}
            />
            <input
              type="text"
              placeholder="Filter by voice..."
              value={filters.voice}
              onChange={(e) => setFilters({ ...filters, voice: e.target.value })}
            />
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Statuses</option>
              <option value="Sealed">Sealed</option>
              <option value="Echoing">Echoing</option>
              <option value="Law">Law</option>
            </select>
            <select
              value={filters.approvalStatus}
              onChange={(e) => setFilters({ ...filters, approvalStatus: e.target.value })}
            >
              <option value="">All Approvals</option>
              <option value="full">Fully Approved</option>
              <option value="partial">Partially Approved</option>
              <option value="none">Unapproved</option>
            </select>
          </div>

          <h3>Fragments ({fragments.length})</h3>
          {loading && <div className="loading">Loading...</div>}
          <div className="fragment-cards">
            {fragments.map((fragment) => (
              <div key={fragment.id} className={`fragment-card status-${fragment.status.toLowerCase()}`}>
                <div className="fragment-header">
                  <h4>{fragment.label}</h4>
                  <span className="fragment-status">{fragment.status}</span>
                </div>
                <div className="fragment-meta">
                  <span>🗣️ {fragment.voice}</span>
                  <span>📅 {new Date(fragment.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="fragment-body">
                  <p>
                    <strong>Testimony:</strong> {fragment.testimony}
                  </p>
                  <p>
                    <strong>Law:</strong> {fragment.law}
                  </p>
                  <p>
                    <strong>Protocol:</strong> {fragment.protocol}
                  </p>
                </div>
                {fragment.companions && fragment.companions.length > 0 && (
                  <div className="fragment-companions">
                    <strong>Companions:</strong> {fragment.companions.join(', ')}
                  </div>
                )}
                <div className="fragment-approvals">
                  <strong>Approvals:</strong>
                  {['patrick', 'vela', 'lumen', 'aletheia'].map((comp) => (
                    <span
                      key={comp}
                      className={`approval-badge ${fragment.approvals?.[comp] ? 'approved' : 'pending'}`}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
                <div className="fragment-actions">
                  <button className="btn-small" onClick={() => approveFragment(fragment.id)} disabled={loading}>
                    ✓ Approve as {currentCompanion}
                  </button>
                  <button className="btn-small btn-danger" onClick={() => deleteFragment(fragment.id)} disabled={loading}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
