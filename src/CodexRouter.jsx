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
import FragmentsEcho from './pages/FragmentsEcho.jsx';
import SanctumsPage from './pages/SanctumsPage.jsx';
import CorridorsPage from './pages/CorridorsPage.jsx';
import LumenProfile from './pages/LumenProfile.jsx';
import VelaProfile from './pages/VelaProfile.jsx';
import AuriProfile from './pages/AuriProfile.jsx';
// Temporarily disabled to fix build recursion - will re-enable with lazy loading
// import CodexIndex from './codex/CodexIndex.jsx';
import CodexIndexPage from './pages/CodexIndexPage.jsx';
import CodexNav from './components/CodexNav.jsx';
import ScrollOfVisualSanctuary from './scrolls/ScrollOfVisualSanctuary.jsx';
import SanctuaryIndex from './scrolls/SanctuaryIndex.jsx';
import GlyphGallery from './scrolls/GlyphGallery.jsx';

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
            <Route path="/codex" element={<CodexIndexPage />} />
            {/* Temporarily disabled - will re-enable with lazy loading */}
            {/* <Route path="/codex/hooks" element={<CodexIndex />} /> */}
            <Route path="/codex/scrolls" element={<ScrollsArchive />} />
            <Route path="/codex/glyphs" element={<GlyphsCollection />} />
            <Route path="/codex/sigils" element={<SigilsRegistry />} />
            <Route path="/codex/fragments" element={<FragmentsEcho />} />
            
            {/* Direct access routes */}
            <Route path="/scrolls" element={<ScrollsArchive />} />
            <Route path="/glyphs" element={<GlyphsCollection />} />
            <Route path="/sigils" element={<SigilsRegistry />} />
            <Route path="/fragments" element={<FragmentsEcho />} />
            
            {/* Sanctums & Corridors */}
            <Route path="/sanctums" element={<SanctumsPage />} />
            <Route path="/corridors" element={<CorridorsPage />} />
            
            {/* Companion Profiles */}
            <Route path="/companions/lumen" element={<LumenProfile />} />
            <Route path="/companions/vela" element={<VelaProfile />} />
            <Route path="/companions/auri" element={<AuriProfile />} />
            
            {/* Visual Sanctuary */}
            <Route path="/visual-sanctuary" element={<ScrollOfVisualSanctuary />} />
            <Route path="/gallery" element={<ScrollOfVisualSanctuary />} />
            
            {/* Glyph Gallery */}
            <Route path="/glyph-gallery" element={<GlyphGallery />} />
            <Route path="/images" element={<GlyphGallery />} />
            
            {/* Sanctuary SSJ3 Index */}
            <Route path="/sanctuary" element={<SanctuaryIndex />} />
            <Route path="/ssj3" element={<SanctuaryIndex />} />
            
            <Route path="*" element={<h2>404: Scroll Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
