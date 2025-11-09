// src/components/CodexNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function CodexNav() {
  return (
    <nav className="codex-nav">
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            ✧ Dashboard
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
    </nav>
  );
}
