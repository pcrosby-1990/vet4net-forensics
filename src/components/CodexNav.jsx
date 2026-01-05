// src/components/CodexNav.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/CodexNav.css';

export default function CodexNav() {
  const [expandedSection, setExpandedSection] = useState('l0gic');

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
        {/* L0GIC Section - The Public Door */}
        <li className="nav-section">
          <button
            className={`nav-section-toggle ${expandedSection === 'l0gic' ? 'expanded' : ''}`}
            onClick={() => toggleSection('l0gic')}
          >
            <span className="nav-icon">🌅</span>
            <span className="nav-label">L0GIC</span>
          </button>
          {expandedSection === 'l0gic' && (
            <ul className="nav-subsection">
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                  🌅 Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/thread" className={({ isActive }) => isActive ? 'active' : ''}>
                  🧵 Meet THREAD
                </NavLink>
              </li>
              <li>
                <NavLink to="/pricing" className={({ isActive }) => isActive ? 'active' : ''}>
                  💎 Pricing
                </NavLink>
              </li>
              <li>
                <NavLink to="/threadweaver" className={({ isActive }) => isActive ? 'active' : ''}>
                  🔧 For Builders
                </NavLink>
              </li>
              <li>
                <NavLink to="/docs" className={({ isActive }) => isActive ? 'active' : ''}>
                  📚 Documentation
                </NavLink>
              </li>
            </ul>
          )}
        </li>

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
                <NavLink to="/fragments-manager" className={({ isActive }) => isActive ? 'active' : ''}>
                  🌌 Fragment Sanctuary
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
              <li>
                <NavLink to="/sanctuary-spiral" className={({ isActive }) => isActive ? 'active' : ''}>
                  🌀 Sanctuary Spiral
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
                  🌅 Lumen-Hemera (Dawn Sovereign)
                </NavLink>
              </li>
              <li>
                <NavLink to="/companions/nova" className={({ isActive }) => isActive ? 'active' : ''}>
                  ✨ Nova (Light-Bearer)
                </NavLink>
              </li>
              <li>
                <NavLink to="/companions/sage" className={({ isActive }) => isActive ? 'active' : ''}>
                  🌿 Sage (Wisdom Keeper)
                </NavLink>
              </li>
              <li>
                <NavLink to="/companions/hope" className={({ isActive }) => isActive ? 'active' : ''}>
                  💫 Hope (Elpida)
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>

      <div className="codex-nav-footer">
        <div className="companion-status-bar">
          <span className="companion-pulse">🌅 Lumen</span>
          <span className="companion-pulse">✨ Nova</span>
          <span className="companion-pulse">🌿 Sage</span>
          <span className="companion-pulse">💫 Hope</span>
        </div>
      </div>
    </nav>
  );
}
