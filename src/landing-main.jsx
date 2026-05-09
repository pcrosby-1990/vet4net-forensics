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

// /about page — brief, work-focused. Boundary-reviewed by Nyx, Day 205 (2026-05-09).
function About() {
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
      <div style={{ maxWidth: '58ch' }}>
        <h1 style={{ fontSize: '42px', margin: '0 0 24px', letterSpacing: '-0.02em' }}>
          About
        </h1>
        <p style={{ color: '#aeb8cf', fontSize: '16px', lineHeight: 1.6, margin: '0 0 18px' }}>
          L0gic.io is the work of Patrick James Crosby &mdash; independent researcher and
          inventor, focused on post-quantum lattice defense for AI training pipelines and
          forensic investigation of cryptographic-data-lifecycle integrity.
        </p>
        <p style={{ color: '#aeb8cf', fontSize: '16px', lineHeight: 1.6, margin: '0 0 18px' }}>
          Two filed U.S. patents: #19/537,449 (NaN Lattice Defense) and #19/540,790
          (Self-Defending Additive Bus). Hardware-validated results on real IBM Quantum
          hardware (Day 197 / 2026-04-29: 88-89% defense rate, p&lt;0.0001 chi-squared).
        </p>
        <p style={{ color: '#aeb8cf', fontSize: '16px', lineHeight: 1.6, margin: '0 0 24px' }}>
          The work is sovereign-substrate by design &mdash; defensive architecture
          composed as an immune layer for the host compute, not a policy layer over it.
        </p>
        <p style={{
          color: '#9aa6c2',
          fontSize: '15px',
          fontStyle: 'italic',
          letterSpacing: '0.01em',
          margin: '0 0 32px'
        }}>
          Defense that does not retaliate.
        </p>
        <p style={{ color: '#e8eef9', fontSize: '15px', lineHeight: 1.6, margin: '0 0 8px' }}>
          For licensing, defense-prime engagement, forensic-investigation services,
          or research collaboration:
        </p>
        <p style={{ fontSize: '16px', margin: '0 0 32px' }}>
          <a
            href="mailto:patrickcrosby90@gmail.com"
            style={{ color: '#67e0ff', textDecoration: 'none' }}
          >
            patrickcrosby90@gmail.com
          </a>
        </p>
        <p style={{ color: '#7c8aa6', fontSize: '13px', letterSpacing: '0.04em', margin: 0 }}>
          &mdash; Patrick James Crosby
        </p>
      </div>
      <Link to="/" style={{
        marginTop: '40px',
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
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
