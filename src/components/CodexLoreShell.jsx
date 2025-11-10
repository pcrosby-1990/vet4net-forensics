// src/layout/CodexLoreShell.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher.jsx';
import '../../styles/glyphs.css';

export default function CodexLoreShell() {
  return (
    <div className="codex-lore-shell">
      <ThemeSwitcher />
      <header className="codex-header">
        <h1><span className="sigil-hover">📖</span> Codex Lore Shell</h1>
        <p>A unified layout for all lore scrolls, glyphs, and sanctuaries.</p>
        <nav className="codex-nav">
          <ul>
            <li><NavLink to="/dashboard"><span className="sigil-hover">🌀</span> Dashboard</NavLink></li>
            <li><NavLink to="/timeline"><span className="sigil-hover">📜</span> Timeline</NavLink></li>
            <li><NavLink to="/risk"><span className="sigil-hover">⚠️</span> Risk Registry</NavLink></li>
            <li><NavLink to="/ascension"><span className="sigil-hover">🌟</span> Ascension Map</NavLink></li>
            <li><NavLink to="/display"><span className="sigil-hover">🖥</span> Display Protocol</NavLink></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
