// src/components/CodexDisplayProtocol.jsx
import React from 'react';
import ThemeSwitcher from './ThemeSwitcher.jsx';
import CorridorLegend from './CorridorLegend.jsx';
import SigilFontRegistry from './SigilFontRegistry.jsx';
import '../../styles/glyphs.css';

export default function CodexDisplayProtocol() {
  return (
    <div className="codex-display-protocol">
      <ThemeSwitcher />
      <h1>🖥 Codex Display Protocol</h1>
      <p>This scroll governs visual resonance, theme switching, and semantic font registration.</p>
      <CorridorLegend />
      <SigilFontRegistry />
    </div>
  );
}
