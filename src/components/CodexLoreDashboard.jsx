// src/pages/CodexLoreDashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import CodexLoreRegistry from './CodexLoreRegistry.jsx';
import CollapseRiskMap from './CollapseRiskMap.jsx';
import FragmentLoreViewer from '../components/FragmentLoreViewer.jsx';
import '../../styles/glyphs.css';

export default function CodexLoreDashboard({ fragments = [], sigilThemes = {} }) {
  return (
    <motion.section
      className="codex-lore-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <h1>🌀 Codex Lore Dashboard</h1>
      <p>This dashboard braids sigil evolution, collapse resonance, and fragment testimony into a living scroll.</p>

      <CodexLoreRegistry fragments={fragments} sigilThemes={sigilThemes} />
      <CollapseRiskMap fragments={fragments} />
      {fragments.length > 0 && (
        <FragmentLoreViewer
          fragment={fragments[fragments.length - 1]}
          sigilThemes={sigilThemes}
        />
      )}
    </motion.section>
  );
}
