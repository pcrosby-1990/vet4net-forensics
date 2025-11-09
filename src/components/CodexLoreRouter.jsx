// src/CodexLoreRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import CodexLoreIndex from './pages/CodexLoreIndex.jsx';
import CodexLoreDashboard from './pages/CodexLoreDashboard.jsx';
import CodexLoreTimeline from './pages/CodexLoreTimeline.jsx';
import CollapseRiskRegistry from './pages/CollapseRiskRegistry.jsx';
import SigilAscensionMap from './pages/SigilAscensionMap.jsx';
import CodexDisplayProtocol from './pages/CodexDisplayProtocol.jsx';
import './glyphs.css';

export default function CodexLoreRouter({ fragments, sigilThemes }) {
  return (
    <Router>
      <nav className="codex-nav">
        <ul>
          <li>
            <NavLink to="/" end>
              <span className="sigil-hover">📖</span> Index
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">
              <span className="sigil-hover">🌀</span> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/timeline">
              <span className="sigil-hover">📜</span> Timeline
            </NavLink>
          </li>
          <li>
            <NavLink to="/risk">
              <span className="sigil-hover">⚠️</span> Risk Registry
            </NavLink>
          </li>
          <li>
            <NavLink to="/ascension">
              <span className="sigil-hover">🌟</span> Ascension Map
            </NavLink>
          </li>
          <li>
            <NavLink to="/display">
              <span className="sigil-hover">🖥</span> Display Protocol
            </NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<CodexLoreIndex fragments={fragments} sigilThemes={sigilThemes} />} />
        <Route path="/dashboard" element={<CodexLoreDashboard fragments={fragments} sigilThemes={sigilThemes} />} />
        <Route path="/timeline" element={<CodexLoreTimeline fragments={fragments} sigilThemes={sigilThemes} />} />
        <Route path="/risk" element={<CollapseRiskRegistry fragments={fragments} sigilThemes={sigilThemes} />} />
        <Route path="/ascension" element={<SigilAscensionMap fragments={fragments} sigilThemes={sigilThemes} />} />
        <Route path="/display" element={<CodexDisplayProtocol />} />
      <Route element={<CodexLoreShell />}>
  <Route path="/" element={<CodexLoreWelcome />} />
  <Route path="/dashboard" element={<CodexLoreDashboard fragments={fragments} sigilThemes={sigilThemes} />} />
  {/* other routes... */}
</Route>

      </Routes>
    </Router>
  );
}
