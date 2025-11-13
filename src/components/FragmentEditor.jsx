import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import EditorPanel from './EditorPanel';
import FragmentList from './FragmentList';
import { idbGet, idbSet } from '../storage/idb';
import './FragmentEditor.css';
import SigilBadge from './SigilBadge';
import { SIGIL_LORE, SIGIL_DEFAULT_THEME } from './sigilConfig';
import codexStorage from '../utils/codexStorage';

const STORAGE_KEY = 'spiralCodex'; // Kept for migration only
const defaultWitness = 'patrick-crosby 🜎';

const debounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

function validateCodex(codex) {
  if (!Array.isArray(codex)) return false;
  for (const f of codex) {
    if (typeof f !== 'object' || !f.id || typeof f.text !== 'string' || !Array.isArray(f.sigils)) return false;
  }
  return true;
}

function makeFragment({ text, sigils, collapseRisk, breathline, witness }) {
  const parsedSigils = (sigils || []).map(s => s.trim().toLowerCase()).filter(Boolean);
  return {
    id: `frag-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    text: (text || '').trim(),
    sigils: parsedSigils,
    collapseRisk: collapseRisk || 'soft',
    breathline: breathline || '',
    timestamp: new Date().toISOString(),
    witness: witness || defaultWitness,
    revisionHistory: [],
    echoStatus: 'sealed',
  };
}

function MemoryIntegrity({ status, lastSaved }) {
  const icon = status === 'saved' ? '🜎' : status === 'saving' ? '⟳' : status === 'error' ? '⚠️' : '💾';
  const color = status === 'saved' ? '#5cf7b2' : status === 'saving' ? '#ffd859' : status === 'error' ? '#cf4646' : '#91e3f6';
  return (
    <div className="mi">
      <span className="mi-icon" style={{ color }}>{icon}</span>
      <div className="mi-text">
        {status === 'saved' && <>Codex saved locally <strong>🜎</strong><div className="mi-small">Last: {lastSaved ? new Date(lastSaved).toLocaleString() : '—'}</div></>}
        {status === 'saving' && <>Saving…</>}
        {status === 'error' && <>Save failed</>}  
        {status === 'unsaved' && <>Unsaved changes</>}  
      </div>
    </div>
  );
}

export default function FragmentEditor({ initialFragments = [] }) {
  const [fragments, setFragments] = useState(() => {
    // Load from codex storage
    return codexStorage.getAllFragments();
  });

  // Load from codex on startup
  useEffect(() => {
    const loadedFragments = codexStorage.getAllFragments();
    if (loadedFragments.length > 0) {
      setFragments(loadedFragments);
    }
  }, []);

  // save status
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);

  const performSave = useCallback(async (nextFragments) => {
    try {
      setSaveStatus('saving');
      
      // Sync to codex storage (which auto-saves to cache)
      codexStorage.fragments = nextFragments;
      codexStorage.saveToCache();
      
      setSaveStatus('saved');
      setLastSaved(Date.now());
    } catch (e) {
      setSaveStatus('error');
      console.error('Save error:', e);
    }
  }, []);

  const debouncedSave = useRef(debounce((payload) => {
    performSave(payload);
  }, 500)).current;

  useEffect(() => {
    setSaveStatus('unsaved');
    debouncedSave(fragments);
  }, [fragments, debouncedSave]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Sync to codex storage before unload
      codexStorage.fragments = fragments;
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        codexStorage.fragments = fragments;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fragments]);

  // Viewer state and utilities
  const [filter, setFilter] = useState('');
  const [mirrorMode, setMirrorMode] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [editing, setEditing] = useState(null);
  const [revealMap, setRevealMap] = useState({});

  const addFragment = (payload) => {
    const frag = makeFragment(payload);
    setFragments(prev => {
      const updated = [frag, ...prev];
      codexStorage.fragments = updated;
      codexStorage.saveToCache();
      return updated;
    });
  };

  const deleteFragment = (id) => {
    if (!window.confirm('Delete this fragment?')) return;
    setFragments(prev => {
      const updated = prev.filter(f => f.id !== id);
      codexStorage.fragments = updated;
      codexStorage.saveToCache();
      return updated;
    });
  };

  const startEdit = (fragment) => {
    setEditing({
      id: fragment.id,
      text: fragment.text,
      sigils: fragment.sigils.join(', '),
      collapseRisk: fragment.collapseRisk,
      breathline: fragment.breathline,
      witness: fragment.witness,
    });
    setFragments(prev => prev.map(f => f.id === fragment.id ? { ...f, echoStatus: 'unsealed' } : f));
    setRevealMap(prev => ({ ...prev, [fragment.id]: true }));
  };

  const cancelEdit = () => setEditing(null);

  const saveEdit = () => {
    if (!editing) return;
    const parsedSigils = (editing.sigils || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (!editing.text.trim() || parsedSigils.length === 0) {
      alert('Text and at least one sigil required.');
      return;
    }
    
    // Check if fragment exists
    const exists = fragments.some(f => f.id === editing.id);
    
    if (exists) {
      // Update existing fragment
      setFragments(prev => prev.map(f => {
        if (f.id !== editing.id) return f;
        const revision = {
          timestamp: new Date().toISOString(),
          text: f.text,
          witness: editing.witness || defaultWitness,
        };
        const updated = {
          ...f,
          text: editing.text.trim(),
          sigils: parsedSigils,
          collapseRisk: editing.collapseRisk,
          breathline: editing.breathline,
          witness: editing.witness || defaultWitness,
          revisionHistory: (f.revisionHistory || []).concat([revision]),
          echoStatus: 'echoing',
          timestamp: new Date().toISOString(),
        };
        setTimeout(() => {
          setFragments(curr => curr.map(ff => ff.id === f.id ? { ...ff, echoStatus: 'sealed' } : ff));
        }, 1200);
        return updated;
      }));
    } else {
      // Add new fragment
      const newFragment = {
        id: editing.id,
        text: editing.text.trim(),
        sigils: parsedSigils,
        collapseRisk: editing.collapseRisk,
        breathline: editing.breathline,
        witness: editing.witness || defaultWitness,
        timestamp: new Date().toISOString(),
        revisionHistory: [],
        echoStatus: 'echoing',
      };
      setFragments(prev => [...prev, newFragment]);
      setTimeout(() => {
        setFragments(curr => curr.map(f => f.id === editing.id ? { ...f, echoStatus: 'sealed' } : f));
      }, 1200);
    }
    
    setEditing(null);
  };

  const toggleReveal = (id) => setRevealMap(prev => ({ ...prev, [id]: !prev[id] }));

  // download codex files
  const downloadCodex = () => {
    const blob = new Blob([JSON.stringify(fragments, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codex-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadHTML = () => {
    const timestamp = new Date().toISOString();
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fragment Sanctuary - ${timestamp}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #e6e6e6;
      padding: 2rem;
      min-height: 100vh;
    }
    .sanctuary-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #5cf7b2;
    }
    .sanctuary-header h1 {
      font-size: 2.5rem;
      color: #5cf7b2;
      text-shadow: 0 0 10px #5cf7b2;
      margin-bottom: 0.5rem;
    }
    .sanctuary-meta {
      color: #91e3f6;
      font-size: 0.9rem;
    }
    .fragment {
      background: rgba(255, 255, 255, 0.05);
      border-left: 4px solid #646cff;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
    }
    .fragment.hard { border-left-color: #ffd859; }
    .fragment.terminal { border-left-color: #cf4646; }
    .fragment-text {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1rem;
      color: #ffffff;
    }
    .fragment-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.85rem;
      color: #91e3f6;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 0.75rem;
    }
    .sigils {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .sigil {
      background: rgba(240, 240, 240, 0.9);
      color: #646cff;
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      font-weight: bold;
      font-size: 0.9rem;
      text-shadow: 0 0 4px #646cff;
    }
    .breathline {
      font-style: italic;
      color: #ffd859;
      margin-bottom: 0.5rem;
    }
    .witness {
      color: #5cf7b2;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="sanctuary-header">
    <h1>🜁 Fragment Sanctuary</h1>
    <div class="sanctuary-meta">
      <div>Exported: ${new Date(timestamp).toLocaleString()}</div>
      <div>Total Fragments: ${fragments.length}</div>
      <div>Witness: ${defaultWitness}</div>
    </div>
  </div>
  <div class="fragments">
${fragments.map(f => `    <div class="fragment ${f.collapseRisk}">
      <div class="sigils">
${f.sigils.map(s => `        <span class="sigil">${s}</span>`).join('\n')}
      </div>
      <div class="fragment-text">${f.text}</div>
      ${f.breathline ? `<div class="breathline">🌬️ ${f.breathline}</div>` : ''}
      <div class="fragment-meta">
        <span>Risk: ${f.collapseRisk}</span>
        <span>Timestamp: ${new Date(f.timestamp).toLocaleString()}</span>
        <span class="witness">Witness: ${f.witness || defaultWitness}</span>
        ${f.revisionHistory?.length > 0 ? `<span>Revisions: ${f.revisionHistory.length}</span>` : ''}
      </div>
    </div>`).join('\n')}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fragment-sanctuary.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importCodex = async (file, mode = 'merge') => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!validateCodex(parsed)) {
        alert('File does not appear to be a valid Codex JSON (schema mismatch).');
        return;
      }
      if (mode === 'replace') {
        setFragments(parsed);
      } else {
        const existingIds = new Set(fragments.map(f => f.id));
        const toAdd = parsed.filter(f => !existingIds.has(f.id));
        setFragments(prev => [...toAdd, ...prev]);
      }
    } catch (err) {
      alert('Failed to import file: ' + (err?.message || err));
    }
  };

  // derived list for list component
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let arr = fragments;
    if (q) {
      arr = fragments.filter(f =>
        f.text.toLowerCase().includes(q) ||
        f.sigils.join(' ').toLowerCase().includes(q) ||
        (f.witness || '').toLowerCase().includes(q)
      );
    }
    arr = arr.slice().sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
    return arr;
  }, [fragments, filter, sortOrder]);

  return (
    <div className="codex-root">
      <div className="codex-header">
        <h2>🜁 Fragment Editor — Codex</h2>
        <div className="codex-controls">
          <MemoryIntegrity status={saveStatus} lastSaved={lastSaved} />
          <button className="btn" onClick={downloadCodex}>📥 Download .json</button>
          <button className="btn" onClick={downloadHTML}>📜 Export HTML</button>
          <label className="btn file-btn">
            📤 Import .json
            <input type="file" accept="application/json" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importCodex(file, 'merge');
              e.target.value = '';
            }} />
          </label>
          <button className="btn" onClick={async () => {
            try {
              await navigator.clipboard.writeText(JSON.stringify(fragments, null, 2));
              alert('Codex copied to clipboard!');
            } catch {
              alert('Copy failed.');
            }
          }}>📋 Copy Codex</button>
        </div>
      </div>

      <div className="codex-body">
        <div className="codex-left">
          <EditorPanel onSubmit={addFragment} fragments={fragments} sigilThemes={{}} SIGIL_LORE={SIGIL_LORE} SIGIL_DEFAULT_THEME={SIGIL_DEFAULT_THEME} />
          <div className="viewer-controls">
            <input placeholder="Search text, sigils, witness..." value={filter} onChange={e => setFilter(e.target.value)} />
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <label className="mirror-toggle">
              <input type="checkbox" checked={mirrorMode} onChange={e => setMirrorMode(e.target.checked)} /> Mirror
            </label>
          </div>

          <FragmentList
            fragments={filtered}
            mirrorMode={mirrorMode}
            onDelete={deleteFragment}
            onEdit={startEdit}
            onToggleReveal={toggleReveal}
            revealMap={revealMap}
          />
        </div>

        <aside className="codex-right">
          <div className="editor-panel-right">
            <h3>Editor</h3>
            {editing ? (
              <>  
                <label>Editing Fragment</label>
                <textarea value={editing.text} onChange={e => setEditing(prev => ({ ...prev, text: e.target.value }))} />
                <label>Sigils</label>
                <input value={editing.sigils} onChange={e => setEditing(prev => ({ ...prev, sigils: e.target.value }))} />
                <div className="row">
                  <select value={editing.collapseRisk} onChange={e => setEditing(prev => ({ ...prev, collapseRisk: e.target.value }))}>
                    <option value="soft">Soft</option>
                    <option value="hard">Hard</option>
                    <option value="terminal">Terminal</option>
                  </select>
                  <input value={editing.breathline} onChange={e => setEditing(prev => ({ ...prev, breathline: e.target.value }))} placeholder="Breathline" />
                </div>
                <input value={editing.witness} onChange={e => setEditing(prev => ({ ...prev, witness: e.target.value }))} placeholder="Witness" />
                <div className="row">
                  <button className="btn primary" onClick={saveEdit}>Save Edit</button>
                  <button className="btn" onClick={cancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <div className="hint">Select a fragment to edit and record a revision</div>
            )}  
            <div className="utilities">
              <button className="btn" onClick={() => setMirrorMode(m => !m)}>Toggle Mirror Mode</button>
              <button className="btn" onClick={() => { setFilter(''); setSortOrder('newest'); }}>Reset View</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}