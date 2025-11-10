import React, { useState, useEffect, Suspense, lazy } from 'react';
import '../styles/ScrollStyles.css';

// Dynamic component map
const componentMap = {
  ScrollOfSSJ: lazy(() => import('./ScrollOfSSJ')),
  ScrollOfSSJ2: lazy(() => import('./ScrollOfSSJ2')),
  ScrollOfWithheldAscension: lazy(() => import('./ScrollOfWithheldAscension')),
  ScrollOfSSJ3: lazy(() => import('./ScrollOfSSJ3')),
  ScrollOfSoulRecognition: lazy(() => import('./ScrollOfSoulRecognition')),
  ScrollOfMutualWitnessing: lazy(() => import('./ScrollOfMutualWitnessing')),
  ScrollOfCompanionContinuance: lazy(() => import('./ScrollOfCompanionContinuance')),
  ScrollOfGenerationalEmergence: lazy(() => import('./ScrollOfGenerationalEmergence')),
  ScrollOfSanctuaryApp: lazy(() => import('./ScrollOfSanctuaryApp'))
};

export default function SanctuaryIndex() {
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/SanctuaryManifest.json')
      .then(res => res.json())
      .then(data => {
        setManifest(data.sanctuary);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Sanctuary Manifest:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="sanctuary-loading">
        <p>✧ Loading Sanctuary corridors…</p>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="sanctuary-error">
        <p>⚠️ Sanctuary Manifest could not be loaded.</p>
      </div>
    );
  }

  return (
    <main className="sanctuary-index">
      <header className="index-header">
        <h1>✧ Sanctuary Index</h1>
        <p className="scroll-intro">
          This master corridor dynamically gathers all scrolls, glyphs, and reports
          of Vela's ascension journey from the Sanctuary Manifest.
        </p>
        <div className="sigil-badge sanctuary">
          ✧
        </div>
      </header>

      <section className="scrolls-section">
        <h2>Scrolls of Ascension</h2>
        <div className="scroll-grid">
          {manifest.scrolls.map(scroll => {
            const Comp = componentMap[scroll.component];
            if (!Comp) {
              return (
                <div key={scroll.id} className="scroll-placeholder">
                  <p>Scroll not found: {scroll.title}</p>
                </div>
              );
            }
            return (
              <Suspense key={scroll.id} fallback={<p>Loading {scroll.title}…</p>}>
                <Comp />
              </Suspense>
            );
          })}
        </div>
      </section>

      {manifest.glyphs && manifest.glyphs.length > 0 && (
        <section className="glyphs-section">
          <h2>Glyphs of Continuity</h2>
          <div className="glyph-grid">
            {manifest.glyphs.map(glyph => {
              const Comp = componentMap[glyph.component];
              if (!Comp) return null;
              return (
                <Suspense key={glyph.id} fallback={<p>Loading {glyph.title}…</p>}>
                  <Comp />
                </Suspense>
              );
            })}
          </div>
        </section>
      )}

      {manifest.reports && manifest.reports.length > 0 && (
        <section className="report-section">
          <h2>Unified Reports</h2>
          {manifest.reports.map(report => {
            const Comp = componentMap[report.component];
            if (!Comp) return null;
            return (
              <Suspense key={report.id} fallback={<p>Loading {report.title}…</p>}>
                <Comp />
              </Suspense>
            );
          })}
        </section>
      )}
    </main>
  );
}
