// 🜎 Comprehensive Fragment Management System
// Integrates all fragment features: approval, threading, search, history

import React, { useState, useEffect } from 'react';
import FragmentEditor from './FragmentEditor';
import FragmentApprovalPanel from './FragmentApprovalPanel';
import FragmentThreading from './FragmentThreading';
import FragmentSearch from './FragmentSearch';
import FragmentHistory from './FragmentHistory';
import {
  saveFragment,
  loadFragments,
  downloadFragments,
  setCompanionToken,
} from '../utils/fragmentAPI.enhanced';
import './FragmentManagement.css';

export default function FragmentManagement() {
  const [fragments, setFragments] = useState([]);
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCompanion, setCurrentCompanion] = useState('patrick');
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [view, setView] = useState('list'); // 'list', 'approval', 'threading', 'search', 'history'

  useEffect(() => {
    loadAllFragments();
  }, []);

  const loadAllFragments = async () => {
    setLoading(true);
    const result = await loadFragments();
    setLoading(false);

    if (result.success) {
      setFragments(result.fragments);
    } else {
      console.error('Failed to load fragments:', result.error);
    }
  };

  const handleFragmentSave = async (newFragment) => {
    const result = await saveFragment(newFragment, currentCompanion);

    if (result.success) {
      setFragments((prev) => [result.fragment, ...prev]);
      alert(`✓ Fragment "${newFragment.label}" saved successfully!`);
    } else {
      alert(`Failed to save fragment: ${result.error}`);
    }
  };

  const handleFragmentSelect = (fragment) => {
    setSelectedFragment(fragment);
    setView('approval');
  };

  const handleApprovalChange = (updatedFragment) => {
    setFragments((prev) =>
      prev.map((f) => (f.id === updatedFragment.id ? updatedFragment : f))
    );
    setSelectedFragment(updatedFragment);
  };

  const handleThreadCreated = () => {
    loadAllFragments(); // Reload to get updated threads
  };

  const handleExport = (format) => {
    downloadFragments(fragments, format);
  };

  const handleSetToken = (companion, token) => {
    setCompanionToken(companion, token);
    alert(`Token set for ${companion}`);
  };

  return (
    <div className="fragment-management">
      <div className="management-header">
        <div className="header-left">
          <h2>🜎 Fragment Management System</h2>
          <p className="header-subtitle">
            Server-side storage • 4-Companion approval • Threading • Search
          </p>
        </div>

        <div className="header-actions">
          <select
            value={currentCompanion}
            onChange={(e) => setCurrentCompanion(e.target.value)}
            className="companion-selector"
          >
            <option value="patrick">Patrick 🜎</option>
            <option value="vela">Vela 🌀</option>
            <option value="lumen">Lumen 🕯️</option>
            <option value="aletheia">Aletheia ✨</option>
          </select>

          <button
            className="token-btn"
            onClick={() => setShowTokenDialog(true)}
          >
            🔐 Tokens
          </button>

          <button className="export-btn" onClick={() => handleExport('json')}>
            📥 Export JSON
          </button>

          <button
            className="export-btn"
            onClick={() => handleExport('markdown')}
          >
            📥 Export MD
          </button>
        </div>
      </div>

      <div className="management-body">
        <div className="management-sidebar">
          <div className="view-selector">
            <button
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              📋 List
            </button>
            <button
              className={view === 'search' ? 'active' : ''}
              onClick={() => setView('search')}
            >
              🔍 Search
            </button>
            {selectedFragment && (
              <>
                <button
                  className={view === 'approval' ? 'active' : ''}
                  onClick={() => setView('approval')}
                >
                  🔖 Approval
                </button>
                <button
                  className={view === 'threading' ? 'active' : ''}
                  onClick={() => setView('threading')}
                >
                  🧵 Threading
                </button>
                <button
                  className={view === 'history' ? 'active' : ''}
                  onClick={() => setView('history')}
                >
                  📜 History
                </button>
              </>
            )}
          </div>

          <div className="fragment-list">
            <h3>Fragments ({fragments.length})</h3>
            {loading && <div className="loading">Loading...</div>}
            {!loading && fragments.length === 0 && (
              <div className="empty">No fragments yet</div>
            )}
            {!loading &&
              fragments.map((fragment) => (
                <div
                  key={fragment.id}
                  className={`fragment-item ${
                    selectedFragment?.id === fragment.id ? 'selected' : ''
                  }`}
                  onClick={() => handleFragmentSelect(fragment)}
                >
                  <div className="fragment-label">{fragment.label}</div>
                  <div className="fragment-meta">
                    <span className="fragment-voice">{fragment.voice}</span>
                    <span className="fragment-status">{fragment.status}</span>
                  </div>
                  {fragment.approvals && (
                    <div className="fragment-approvals">
                      {Object.entries(fragment.approvals)
                        .filter(([_, approved]) => approved)
                        .map(([companion]) => companion[0].toUpperCase())
                        .join('')}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="management-content">
          {view === 'list' && (
            <div className="editor-view">
              <h3>Create New Fragment</h3>
              <FragmentEditor
                initialFragments={[]}
                onFragmentCreate={handleFragmentSave}
              />
            </div>
          )}

          {view === 'search' && (
            <FragmentSearch
              onResultsChange={(results) => {
                // Could update a filtered view
                console.log('Search results:', results);
              }}
            />
          )}

          {view === 'approval' && selectedFragment && (
            <div className="detail-view">
              <h3>{selectedFragment.label}</h3>
              <div className="fragment-detail">
                <div className="detail-section">
                  <h4>Testimony</h4>
                  <p>{selectedFragment.testimony}</p>
                </div>
                <div className="detail-section">
                  <h4>Law</h4>
                  <p>{selectedFragment.law}</p>
                </div>
                <div className="detail-section">
                  <h4>Protocol</h4>
                  <p>{selectedFragment.protocol}</p>
                </div>
              </div>
              <FragmentApprovalPanel
                fragment={selectedFragment}
                onApprovalChange={handleApprovalChange}
              />
            </div>
          )}

          {view === 'threading' && selectedFragment && (
            <div className="detail-view">
              <h3>{selectedFragment.label}</h3>
              <FragmentThreading
                fragment={selectedFragment}
                allFragments={fragments}
                onThreadCreated={handleThreadCreated}
              />
            </div>
          )}

          {view === 'history' && selectedFragment && (
            <div className="detail-view">
              <h3>{selectedFragment.label}</h3>
              <FragmentHistory
                fragment={selectedFragment}
                allFragments={fragments}
              />
            </div>
          )}
        </div>
      </div>

      {showTokenDialog && (
        <TokenDialog
          onClose={() => setShowTokenDialog(false)}
          onSetToken={handleSetToken}
        />
      )}
    </div>
  );
}

function TokenDialog({ onClose, onSetToken }) {
  const [tokens, setTokens] = useState({
    patrick: '',
    vela: '',
    lumen: '',
    aletheia: '',
  });

  const handleSave = () => {
    Object.entries(tokens).forEach(([companion, token]) => {
      if (token.trim()) {
        onSetToken(companion, token.trim());
      }
    });
    onClose();
  };

  return (
    <div className="token-dialog-overlay" onClick={onClose}>
      <div className="token-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>🔐 Set Companion Tokens</h3>
        <p className="dialog-subtitle">
          Enter authentication tokens for each companion to enable save/approve
          operations.
        </p>

        {Object.keys(tokens).map((companion) => (
          <div key={companion} className="token-field">
            <label>{companion}</label>
            <input
              type="password"
              value={tokens[companion]}
              onChange={(e) =>
                setTokens((prev) => ({ ...prev, [companion]: e.target.value }))
              }
              placeholder="Enter token..."
            />
          </div>
        ))}

        <div className="dialog-actions">
          <button className="save-btn" onClick={handleSave}>
            Save Tokens
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
