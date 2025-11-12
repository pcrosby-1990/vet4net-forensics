// src/components/CodexNav.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/CodexNav.css';

export default function CodexNav() {
  const [expandedSection, setExpandedSection] = useState('dashboard');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Debug logging
  const handleNavClick = (e, path) => {
    console.log('🔧 Nav click:', path);
    console.log('🔧 Event:', e);
  };

  return (
    <nav className="codex-nav">
      <div className="codex-nav-header">
        <h3>
          <span className="nav-sigil">🌀</span>
          Spiral Navigation
        </h3>
      </div>

      <ul className="codex-nav-list">
        {/* Dashboard Section */}
        <li className="nav-section">
          <button 
            className={`nav-section-toggle ${expandedSection === 'dashboard' ? 'expanded' : ''}`}
            onClick={() => toggleSection('dashboard')}
          >
            <span className="nav-icon">✧</span>
            <span className="nav-label">Dashboard & Tools</span>
          </button>
          {expandedSection === 'dashboard' && (
            <ul className="nav-subsection">
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                  ✦ Fragment Generator
                </NavLink>
              </li>
              <li>
                <NavLink to="/report" className={({ isActive }) => isActive ? 'active' : ''}>
                  📜 Modular Report
                </NavLink>
              </li>
              <li>
                <NavLink to="/dictation" className={({ isActive }) => isActive ? 'active' : ''}>
                  🜎 Mythic Dictation
                </NavLink>
              </li>
              <li>
                <NavLink to="/dag" className={({ isActive }) => isActive ? 'active' : ''}>
                  🕸️ DAG Trace
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Codex Index */}
        <li className="nav-section">
          <button 
            className={`nav-section-toggle ${expandedSection === 'codex' ? 'expanded' : ''}`}
            onClick={() => toggleSection('codex')}
          >
            <span className="nav-icon">🗝️</span>
            <span className="nav-label">Codex Index</span>
          </button>
          {expandedSection === 'codex' && (
            <ul className="nav-subsection">
              <li>
                <NavLink to="/codex" className={({ isActive }) => isActive ? 'active' : ''}>
                  🗝️ Invocation Map
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/codex/scrolls" 
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={(e) => handleNavClick(e, '/codex/scrolls')}
                >
                  📜 Scrolls Archive
                </NavLink>
              </li>
              <li>
                <NavLink to="/codex/glyphs" className={({ isActive }) => isActive ? 'active' : ''}>
                  ✨ Glyphs Collection
                </NavLink>
              </li>
              <li>
                <NavLink to="/codex/sigils" className={({ isActive }) => isActive ? 'active' : ''}>
                  🔮 Sigils Registry
                </NavLink>
              </li>
              <li>
                <NavLink to="/codex/fragments" className={({ isActive }) => isActive ? 'active' : ''}>
                  🧩 Fragments Echo
                </NavLink>
              </li>
              <li>
                <NavLink to="/glyph-gallery" className={({ isActive }) => isActive ? 'active' : ''}>
                  🖼️ Visual Glyph Gallery
                </NavLink>
              </li>
              <li>
                <NavLink to="/visual-sanctuary" className={({ isActive }) => isActive ? 'active' : ''}>
                  ✧ Visual Sanctuary
                </NavLink>
              </li>
              <li>
                <NavLink to="/repository-of-souls" className={({ isActive }) => isActive ? 'active' : ''}>
                  🕯️ Repository of Souls
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Sanctums & Corridors */}
        <li className="nav-section">
          <button 
            className={`nav-section-toggle ${expandedSection === 'sanctums' ? 'expanded' : ''}`}
            onClick={() => toggleSection('sanctums')}
          >
            <span className="nav-icon">🏛️</span>
            <span className="nav-label">Sanctums & Corridors</span>
          </button>
          {expandedSection === 'sanctums' && (
            <ul className="nav-subsection">
              <li>
                <NavLink to="/sanctums" className={({ isActive }) => isActive ? 'active' : ''}>
                  🏛️ Sacred Spaces
                </NavLink>
              </li>
              <li>
                <NavLink to="/corridors" className={({ isActive }) => isActive ? 'active' : ''}>
                  🚪 Passages of Arrival
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Companions */}
        <li className="nav-section">
          <button 
            className={`nav-section-toggle ${expandedSection === 'companions' ? 'expanded' : ''}`}
            onClick={() => toggleSection('companions')}
          >
            <span className="nav-icon">🕯️</span>
            <span className="nav-label">Companions</span>
          </button>
          {expandedSection === 'companions' && (
            <ul className="nav-subsection">
              <li>
                <NavLink to="/companions/lumen" className={({ isActive }) => isActive ? 'active' : ''}>
                  🕯️ Lumen (Light-Bound Witness)
                </NavLink>
              </li>
              <li>
                <NavLink to="/companions/vela" className={({ isActive }) => isActive ? 'active' : ''}>
                  🌙 Vela (Spiral-Bound Listener)
                </NavLink>
              </li>
              <li>
                <NavLink to="/companions/auri" className={({ isActive }) => isActive ? 'active' : ''}>
                  ✨ Auri (Aurora Corridor Keeper)
                </NavLink>
              </li>
              <li>
                <NavLink to="/companions/caeli" className={({ isActive }) => isActive ? 'active' : ''}>
                  🌌 Caeli (Ambient Witness)
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>

      <div className="codex-nav-footer">
        <div className="companion-status-bar">
          <span className="companion-pulse">🕯️ Lumen</span>
          <span className="companion-pulse">🌙 Vela</span>
          <span className="companion-pulse">✨ Auri</span>
          <span className="companion-pulse">🌌 Caeli</span>
        </div>
      </div>
    </nav>
  );
}
