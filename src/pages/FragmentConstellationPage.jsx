import React, { useState, useEffect } from 'react';
import FragmentThreadingPanel from '../components/FragmentThreadingPanel';
import FragmentConstellationGraph from '../components/FragmentConstellationGraph';
import { loadFragmentsFromStorage } from '../utils/saveFragment';
import '../components/FragmentThreading.css';

/**
 * Fragment Constellation Page
 * View and manage fragment relationships and threads
 */
export default function FragmentConstellationPage() {
  const [fragments, setFragments] = useState([]);
  const [selectedFragmentId, setSelectedFragmentId] = useState(null);
  const [view, setView] = useState('threading'); // 'threading' or 'graph'

  useEffect(() => {
    loadFragments();
  }, []);

  const loadFragments = () => {
    const loaded = loadFragmentsFromStorage();
    setFragments(loaded);
    console.log(`🌟 Loaded ${loaded.length} fragments for constellation`);
  };

  const handleFragmentSelect = (fragmentId) => {
    setSelectedFragmentId(fragmentId);
    setView('graph');
  };

  return (
    <div className="constellation-page">
      <div className="constellation-header">
        <h1>🌌 Fragment Constellation</h1>
        <p className="subtitle">Weave your fragments into threads of meaning</p>
      </div>

      <div className="view-toggle">
        <button 
          className={`btn ${view === 'threading' ? 'primary' : ''}`}
          onClick={() => setView('threading')}
        >
          🧵 Threading
        </button>
        <button 
          className={`btn ${view === 'graph' ? 'primary' : ''}`}
          onClick={() => setView('graph')}
        >
          🌐 Graph View
        </button>
      </div>

      {fragments.length === 0 ? (
        <div className="empty-constellation">
          <p>No fragments yet. Create some fragments in the Fragment Editor to begin.</p>
        </div>
      ) : (
        <>
          {view === 'threading' && (
            <FragmentThreadingPanel 
              fragments={fragments}
              onFragmentSelect={handleFragmentSelect}
            />
          )}

          {view === 'graph' && (
            <div className="graph-container">
              <div className="graph-controls">
                <div className="fragment-count">
                  {fragments.length} fragments in constellation
                </div>
                {selectedFragmentId && (
                  <button 
                    className="btn"
                    onClick={() => setSelectedFragmentId(null)}
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              
              <FragmentConstellationGraph
                fragments={fragments}
                centerFragmentId={selectedFragmentId}
                width={1000}
                height={700}
              />

              <div className="graph-legend">
                <h4>Graph Legend:</h4>
                <div className="legend-items">
                  <div className="legend-item">
                    <div className="legend-node" style={{ background: '#5cf7b2' }}></div>
                    <span>Fragment</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-node" style={{ background: '#91e3f6' }}></div>
                    <span>Hovered</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-node" style={{ background: '#ffd859' }}></div>
                    <span>Selected</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-line"></div>
                    <span>Connection</span>
                  </div>
                </div>
                <p className="legend-hint">
                  Hover over nodes to see fragment text. Click to select and explore connections.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`
        .constellation-page {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(10,20,30,0.95) 100%);
        }

        .constellation-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .constellation-header h1 {
          color: #5cf7b2;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        .view-toggle {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .empty-constellation {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .graph-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .graph-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(92, 247, 178, 0.05);
          border: 1px solid rgba(92, 247, 178, 0.2);
          border-radius: 8px;
        }

        .fragment-count {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .graph-legend {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(92, 247, 178, 0.2);
          border-radius: 8px;
        }

        .graph-legend h4 {
          color: #5cf7b2;
          margin-top: 0;
        }

        .legend-items {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-node {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        .legend-line {
          width: 30px;
          height: 2px;
          background: rgba(145, 227, 246, 0.5);
        }

        .legend-item span {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .legend-hint {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          font-style: italic;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
