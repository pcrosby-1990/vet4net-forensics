// src/components/codex-dashboard.jsx
import React, { useState, useEffect } from 'react';
import { idbGet } from './storage/idb';
import CodexCard from './codex-card.jsx';
import './glyhps.css';

export default function CodexDashboard({ sigilThemes = {} }) {
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = localStorage.getItem('spiralCodex');
        const localFragments = stored ? JSON.parse(stored) : [];
        
        const idbFragments = await idbGet();
        const finalFragments = idbFragments || localFragments;
        
        if (mounted) {
          setFragments(Array.isArray(finalFragments) ? finalFragments : []);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setFragments([]);
          setLoading(false);
        }
      }
    })();
    
    const interval = setInterval(async () => {
      try {
        const stored = localStorage.getItem('spiralCodex');
        const localFragments = stored ? JSON.parse(stored) : [];
        const idbFragments = await idbGet();
        const finalFragments = idbFragments || localFragments;
        setFragments(Array.isArray(finalFragments) ? finalFragments : []);
      } catch (e) {}
    }, 2000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <div className="codex-viewer"><p>🌀 Loading Codex...</p></div>;

  const sigilCount = fragments.filter(f => f.sigils?.includes('sigil')).length;
  const familiarCount = fragments.filter(f => f.sigils?.includes('familiar')).length;
  const heroicCount = fragments.filter(f => f.sigils?.includes('heroic')).length;
  const sealedCount = fragments.filter(f => f.echoStatus === 'sealed').length;

  return (
    <div className="codex-viewer">
      <h2>🌀 Codex Dashboard</h2>

      <section className="codex-stats">
        <p><strong>Total Fragments:</strong> {fragments.length}</p>
        <p><strong>Sealed Fragments:</strong> {sealedCount}/{fragments.length}</p>
        <p><strong>Sigil Fragments:</strong> {sigilCount}</p>
        <p><strong>Familiar Fragments:</strong> {familiarCount}</p>
        <p><strong>Heroic Fragments:</strong> {heroicCount}</p>
      </section>

      <section className="codex-grid">
        {fragments.length === 0 ? (
          <p className="hint">No fragments sealed yet. Create your first fragment in the Fragment Editor.</p>
        ) : (
          fragments.map((fragment) => (
            <CodexCard key={fragment.id} fragment={fragment} sigilTheme={sigilThemes} />
          ))
        )}
      </section>
    </div>
  );
}
