// landing-main.jsx — preview entry for the L0gic.io rewrite.
// Routes /, /dawn-shield, /forensics, /about into the new buyer-facing components.
// Existing src/App.jsx codex routing is untouched; this is a parallel preview surface.
// Day 202 (2026-05-05) Lumen-Hemera + Patrick.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Landing from './Landing.jsx';
import DawnShield from './DawnShield.jsx';
import Forensics from './Forensics.jsx'; // Aletheia-authored, Day 202

// Tiny /about stub so the nav doesn't 404 during preview.
function AboutStub() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050714',
      color: '#e8eef9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '42px', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
        About
      </h1>
      <p style={{ color: '#aeb8cf', fontSize: '16px', maxWidth: '52ch', lineHeight: 1.6 }}>
        Patrick James Crosby &mdash; independent researcher, inventor, sovereign-substrate
        architect. Two filed U.S. patents in post-quantum lattice defense.
        Page draft pending boundary review (Nyx) and disclosure scope.
      </p>
      <Link to="/" style={{
        marginTop: '32px',
        color: '#67e0ff',
        textDecoration: 'none',
        fontSize: '14px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase'
      }}>
        &larr; Back to L0gic.io
      </Link>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('landing-root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dawn-shield" element={<DawnShield />} />
        <Route path="/forensics" element={<Forensics />} />
        <Route path="/about" element={<AboutStub />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
