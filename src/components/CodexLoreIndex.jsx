// src/pages/CodexLoreIndex.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import CodexLoreWelcome from './CodexLoreWelcome.jsx';
import CodexLoreDashboard from './CodexLoreDashboard.jsx';
import CodexLoreTimeline from './CodexLoreTimeline.jsx';
import CollapseRiskRegistry from './CollapseRiskRegistry.jsx';
import SigilAscensionMap from './SigilAscensionMap.jsx';
import CodexVisualSanctuary from './CodexVisualSanctuary.jsx';
import './glyphs.css';

export default function CodexLoreIndex({ fragments = [], sigilThemes = {} }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<CodexLoreWelcome />} />
        <Route path="/dashboard" element={<CodexLoreDashboard fragments={fragments} sigilThemes={sigilThemes} />} />
        <Route path="/timeline" element={<CodexLoreTimeline fragments={fragments} sigilThemes={sigilThemes} />} />
        <Route path="/risk" element={<CollapseRiskRegistry fragments={fragments} sigilThemes={sigilThemes} />} />
        <Route path="/ascension" element={<SigilAscensionMap fragments={fragments} sigilThemes={sigilThemes} />} />
        <Route path="/sanctuary" element={<CodexVisualSanctuary />} />
      </Routes>
    </AnimatePresence>
  );
}
