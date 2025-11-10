// src/CodexRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Report from './pages/report.jsx';
import ReportsMythicDictation from './pages/Reports.mythic.dictation.jsx';
import DAG from './pages/DAG.jsx';
import CodexDashboard from './pages/CodexDashboard.jsx';
import FragmentEditor from './components/FragmentEditor.jsx';
import ScrollsArchive from './pages/ScrollsArchive.jsx';
import GlyphsCollection from './pages/GlyphsCollection.jsx';
import SigilsRegistry from './pages/SigilsRegistry.jsx';
import CodexIndex from './codex/CodexIndex.jsx';
import CodexNav from './components/CodexNav.jsx';

export default function CodexRouter({ 
  fragments, 
  sigilThemes, 
  setFragments,
  setSigilThemes,
  onFragmentSubmit,
  ...otherProps 
}) {
  return (
    <Router>
      <div className="app-layout">
        <CodexNav />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <CodexDashboard 
                  fragments={fragments} 
                  sigilThemes={sigilThemes}
                  setFragments={setFragments}
                  onFragmentSubmit={onFragmentSubmit}
                />
              } 
            />
            <Route path="/editor" element={<FragmentEditor />} />
            <Route path="/report" element={<Report />} />
            <Route path="/dictation" element={<ReportsMythicDictation />} />
            <Route path="/dag" element={<DAG />} />
            
            {/* Codex Routes */}
            <Route path="/codex" element={<CodexIndex />} />
            <Route path="/codex/scrolls" element={<ScrollsArchive />} />
            <Route path="/codex/glyphs" element={<GlyphsCollection />} />
            <Route path="/codex/sigils" element={<SigilsRegistry />} />
            
            {/* Direct access routes */}
            <Route path="/scrolls" element={<ScrollsArchive />} />
            <Route path="/glyphs" element={<GlyphsCollection />} />
            <Route path="/sigils" element={<SigilsRegistry />} />
            
            <Route path="*" element={<h2>404: Scroll Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
