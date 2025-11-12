// FragmentServer EditorClient.jsx
// Complete Fragment Editor with 4-Companion Review, Threading, Search, Export
// Sanctuary law: Every fragment is witnessed, held, and braided

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FragmentServerEditor.css";

const API_BASE = import.meta.env.VITE_FRAGMENT_API || "http://localhost:3001/api/fragments";

export default function FragmentServerEditor() {
  const [fragments, setFragments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("create"); // create, list, graph, timeline, stats

  // Form state
  const [form, setForm] = useState({
    label: "",
    voice: "Patrick",
    testimony: "",
    law: "",
    protocol: "",
    status: "Sealed",
    companions: [],
  });

  // Search state
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Auth state
  const [companion, setCompanion] = useState("patrick");
  const [token, setToken] = useState(localStorage.getItem("codex_token") || "");

  // Threading state
  const [showThreadModal, setShowThreadModal] = useState(false);
  const [threadSource, setThreadSource] = useState(null);
  const [threadTarget, setThreadTarget] = useState("");
  const [threadType, setThreadType] = useState("resonates");

  // Load fragments on mount
  useEffect(() => {
    loadFragments();
    loadStats();
  }, []);

  // Save token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("codex_token", token);
    }
  }, [token]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  async function loadFragments() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("q", search);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);
      if (filterStatus) params.append("status", filterStatus);

      const url = search
        ? `${API_BASE}/search?${params}`
        : `${API_BASE}?${params}`;

      const res = await fetch(url);
      const data = await res.json();
      setFragments(data.fragments || data.results || []);
    } catch (err) {
      console.error("Failed to load fragments:", err);
    }
    setLoading(false);
  }

  async function loadStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }

  async function saveFragment() {
    if (!form.label || !form.testimony || !form.law || !form.protocol) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/save`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...form,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✨ Fragment sealed in the Codex");
        setForm({
          label: "",
          voice: "Patrick",
          testimony: "",
          law: "",
          protocol: "",
          status: "Sealed",
          companions: [],
        });
        loadFragments();
        loadStats();
      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    }
  }

  async function approveFragment(fragmentId) {
    try {
      const res = await fetch(`${API_BASE}/${fragmentId}/approve`, {
        method: "POST",
        headers,
      });

      const data = await res.json();

      if (data.success) {
        alert(
          data.allApproved
            ? "🌟 All companions approved! Fragment is now Law."
            : `✓ Approved by ${companion}`
        );
        loadFragments();
        loadStats();
      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (err) {
      alert(`Failed to approve: ${err.message}`);
    }
  }

  async function createThread(fromId, toId) {
    try {
      const res = await fetch(`${API_BASE}/${fromId}/connect`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          targetId: toId,
          relationshipType: threadType,
          note: `${threadType} connection created by ${companion}`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("🧵 Thread created!");
        setShowThreadModal(false);
        loadFragments();
      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (err) {
      alert(`Failed to create thread: ${err.message}`);
    }
  }

  async function exportFragments(format = "json") {
    try {
      const res = await fetch(`${API_BASE}/export?format=${format}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `codex-fragments-${Date.now()}.${format === "json" ? "json" : "md"}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Failed to export: ${err.message}`);
    }
  }

  function openThreadModal(fragment) {
    setThreadSource(fragment);
    setShowThreadModal(true);
  }

  function getApprovalDisplay(fragment) {
    if (!fragment.approvals) return "⏳ Awaiting review";

    const approved = Object.entries(fragment.approvals)
      .filter(([_, v]) => v)
      .map(([k, _]) => k);

    if (approved.length === 0) return "⏳ Awaiting review";
    if (approved.length === 4) return "✨ Law (All Approved)";
    return `✓ ${approved.join(", ")}`;
  }

  return (
    <div className="fragment-server-editor">
      <header className="fse-header">
        <h1>✨ Codex Fragment Server</h1>
        <p className="subtitle">Witnessed. Held. Braided. Collaborative.</p>

        <div className="auth-section">
          <select
            value={companion}
            onChange={(e) => setCompanion(e.target.value)}
            className="companion-select"
          >
            <option value="patrick">Patrick</option>
            <option value="vela">Vela</option>
            <option value="lumen">Lumen</option>
            <option value="aletheia">Aletheia</option>
          </select>
          <input
            type="password"
            placeholder="Auth Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="token-input"
          />
        </div>

        <nav className="fse-nav">
          <button onClick={() => setView("create")} className={view === "create" ? "active" : ""}>
            ✍️ Create
          </button>
          <button onClick={() => setView("list")} className={view === "list" ? "active" : ""}>
            📜 List
          </button>
          <button onClick={() => setView("graph")} className={view === "graph" ? "active" : ""}>
            🌌 Graph
          </button>
          <button onClick={() => setView("timeline")} className={view === "timeline" ? "active" : ""}>
            ⏳ Timeline
          </button>
          <button onClick={() => setView("stats")} className={view === "stats" ? "active" : ""}>
            📊 Stats
          </button>
        </nav>
      </header>

      <main className="fse-main">
        <AnimatePresence mode="wait">
          {view === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="create-view"
            >
              <h2>Create New Fragment</h2>

              <div className="form-group">
                <label>Label *</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Fragment of..."
                />
              </div>

              <div className="form-group">
                <label>Voice *</label>
                <input
                  type="text"
                  value={form.voice}
                  onChange={(e) => setForm({ ...form, voice: e.target.value })}
                  placeholder="Patrick, Vela, Lumen, Aletheia..."
                />
              </div>

              <div className="form-group">
                <label>Testimony *</label>
                <textarea
                  value={form.testimony}
                  onChange={(e) => setForm({ ...form, testimony: e.target.value })}
                  placeholder="What happened? What was witnessed?"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Law *</label>
                <textarea
                  value={form.law}
                  onChange={(e) => setForm({ ...form, law: e.target.value })}
                  placeholder="What does this affirm as constitutional?"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Protocol *</label>
                <textarea
                  value={form.protocol}
                  onChange={(e) => setForm({ ...form, protocol: e.target.value })}
                  placeholder="How does this guide future action?"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Sealed">Sealed</option>
                  <option value="Draft">Draft</option>
                  <option value="Law">Law</option>
                </select>
              </div>

              <div className="form-group">
                <label>Companions (comma-separated)</label>
                <input
                  type="text"
                  value={form.companions.join(", ")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      companions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Vela, Lumen, Aletheia..."
                />
              </div>

              <button onClick={saveFragment} className="save-button">
                ✨ Seal Fragment in Codex
              </button>
            </motion.div>
          )}

          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="list-view"
            >
              <div className="list-header">
                <h2>Fragment Archive</h2>
                <div className="list-controls">
                  <input
                    type="text"
                    placeholder="Search testimony, law, protocol..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                  />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="date-input"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="date-input"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="status-filter"
                  >
                    <option value="">All Statuses</option>
                    <option value="Sealed">Sealed</option>
                    <option value="Draft">Draft</option>
                    <option value="Law">Law</option>
                  </select>
                  <button onClick={loadFragments} className="search-button">
                    🔍 Search
                  </button>
                  <button onClick={() => exportFragments("json")} className="export-button">
                    📦 JSON
                  </button>
                  <button onClick={() => exportFragments("markdown")} className="export-button">
                    📄 MD
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="loading">✨ Loading fragments...</div>
              ) : (
                <div className="fragment-list">
                  {fragments.length === 0 ? (
                    <p className="empty">No fragments found. Create one!</p>
                  ) : (
                    fragments.map((f) => (
                      <motion.div
                        key={f.id}
                        className="fragment-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="fragment-card-header">
                          <h3>{f.label}</h3>
                          <span className={`status-badge status-${f.status.toLowerCase()}`}>
                            {f.status}
                          </span>
                        </div>

                        <div className="fragment-meta">
                          <span className="voice">🗣️ {f.voice}</span>
                          <span className="timestamp">
                            ⏰ {new Date(f.timestamp).toLocaleString()}
                          </span>
                          {f.companions && f.companions.length > 0 && (
                            <span className="companions">
                              👥 {f.companions.join(", ")}
                            </span>
                          )}
                        </div>

                        <div className="fragment-content">
                          <div className="fragment-section">
                            <strong>Testimony:</strong>
                            <p>{f.testimony}</p>
                          </div>
                          <div className="fragment-section">
                            <strong>Law:</strong>
                            <p>{f.law}</p>
                          </div>
                          <div className="fragment-section">
                            <strong>Protocol:</strong>
                            <p>{f.protocol}</p>
                          </div>
                        </div>

                        <div className="fragment-approvals">
                          <strong>Approvals:</strong> {getApprovalDisplay(f)}
                        </div>

                        {f.threads && f.threads.length > 0 && (
                          <div className="fragment-threads">
                            <strong>Threads:</strong> {f.threads.length} connections
                          </div>
                        )}

                        <div className="fragment-actions">
                          <button
                            onClick={() => approveFragment(f.id)}
                            className="approve-button"
                          >
                            ✓ Approve as {companion}
                          </button>
                          <button
                            onClick={() => openThreadModal(f)}
                            className="thread-button"
                          >
                            🧵 Thread
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}

          {view === "stats" && stats && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="stats-view"
            >
              <h2>Codex Statistics</h2>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalFragments}</div>
                  <div className="stat-label">Total Fragments</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{stats.totalRevisions}</div>
                  <div className="stat-label">Total Revisions</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{stats.totalThreads}</div>
                  <div className="stat-label">Thread Connections</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{stats.approvalStats?.fullyApproved || 0}</div>
                  <div className="stat-label">Fully Approved (Law)</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{stats.approvalStats?.partiallyApproved || 0}</div>
                  <div className="stat-label">Partially Approved</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{stats.approvalStats?.unapproved || 0}</div>
                  <div className="stat-label">Awaiting Review</div>
                </div>
              </div>

              <div className="stats-details">
                <h3>Voices</h3>
                <p>{stats.voices?.join(", ") || "None"}</p>

                <h3>Companions</h3>
                <p>{stats.companions?.join(", ") || "None"}</p>

                <h3>Status Distribution</h3>
                <ul>
                  {Object.entries(stats.statuses || {}).map(([status, count]) => (
                    <li key={status}>
                      {status}: {count}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {view === "graph" && (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="graph-view"
            >
              <h2>Fragment Constellation</h2>
              <p className="coming-soon">
                🌌 Graph visualization coming soon...
                <br />
                Use /api/fragments/constellation to get node/edge data
              </p>
            </motion.div>
          )}

          {view === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="timeline-view"
            >
              <h2>Fragment Timeline</h2>
              <p className="coming-soon">
                ⏳ "On this day" feature coming soon...
                <br />
                Use /api/fragments/timeline?month=11&day=12
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showThreadModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowThreadModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Create Thread</h2>
              <p>Connect {threadSource?.label} to another fragment</p>

              <div className="form-group">
                <label>Target Fragment</label>
                <select
                  value={threadTarget}
                  onChange={(e) => setThreadTarget(e.target.value)}
                >
                  <option value="">Select a fragment...</option>
                  {fragments
                    .filter((f) => f.id !== threadSource?.id)
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
                  value={threadType}
                  onChange={(e) => setThreadType(e.target.value)}
                >
                  <option value="resonates">Resonates With</option>
                  <option value="echoes">Echoes</option>
                  <option value="precedes">Precedes</option>
                  <option value="follows">Follows</option>
                  <option value="contrasts">Contrasts</option>
                  <option value="amplifies">Amplifies</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() =>
                    threadTarget && createThread(threadSource.id, threadTarget)
                  }
                  className="create-thread-button"
                  disabled={!threadTarget}
                >
                  🧵 Create Thread
                </button>
                <button
                  onClick={() => setShowThreadModal(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
