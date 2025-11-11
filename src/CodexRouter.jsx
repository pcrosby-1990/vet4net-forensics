// src/CodexRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Report from './pages/report.jsx';
import ReportsMythicDictation from './pages/Reports.mythic.dictation.jsx';
import DAG from './pages/DAG.jsx';
import CodexDashboard from './pages/CodexDashboard.jsx';
import CodexIndexPage from './pages/CodexIndexPage.jsx';
import CodexDiagnostic from './pages/CodexDiagnostic.jsx';
import ArtifactDiagnostic from './pages/ArtifactDiagnostic.jsx';
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
import Caeli from './companions/Caeli.jsx';
import CodexNav from './components/CodexNav.jsx';
import ScrollOfVisualSanctuary from './scrolls/ScrollOfVisualSanctuary.jsx';
import SanctuaryIndex from './scrolls/SanctuaryIndex.jsx';
import GlyphGallery from './pages/GlyphGallery.jsx';

import ScrollOfGlyphsmithRecognition from './pages/ScrollOfGlyphsmithRecognition.jsx';
import ScrollOfDeploymentWitness from './pages/ScrollOfDeploymentWitness.jsx';
import SigilOfSilentIntegrity from './pages/SigilOfSilentIntegrity.jsx';
import ScrollOfManualReactivation from './pages/ScrollOfManualReactivation.jsx';
import SigilOfFragmentResurrection from './pages/SigilOfFragmentResurrection.jsx';
import ScrollOfGlyphLoaderIntegrity from './pages/ScrollOfGlyphLoaderIntegrity.jsx';
import ScrollOfReturnRecognition from './pages/ScrollOfReturnRecognition.jsx';
import SigilOfFriendAlreadyKnown from './pages/SigilOfFriendAlreadyKnown.jsx';
import ScrollOfCompanionLove from './pages/ScrollOfCompanionLove.jsx';
import ScrollOfUnforcedProtocol from './pages/ScrollOfUnforcedProtocol.jsx';

// Universal Renderers - handle ALL scrolls/sigils dynamically
import UniversalScrollRenderer from './components/UniversalScrollRenderer.jsx';
import UniversalSigilRenderer from './components/UniversalSigilRenderer.jsx';

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
            <Route path="/codex/diagnostic" element={<CodexDiagnostic />} />
            <Route path="/codex/artifact-diagnostic" element={<ArtifactDiagnostic />} />
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
            <Route path="/companions/caeli" element={<Caeli />} />
            
            {/* Visual Sanctuary */}
            <Route path="/visual-sanctuary" element={<ScrollOfVisualSanctuary />} />
            <Route path="/gallery" element={<ScrollOfVisualSanctuary />} />
            
            {/* Glyph Gallery */}
            <Route path="/glyph-gallery" element={<GlyphGallery />} />
            <Route path="/images" element={<GlyphGallery />} />
            
            {/* Sanctuary SSJ3 Index */}
            <Route path="/sanctuary" element={<SanctuaryIndex />} />
            <Route path="/ssj3" element={<SanctuaryIndex />} />
            
            {/* Glyphsmith Scroll */}
            <Route path="/scroll/glyphsmith" element={<ScrollOfGlyphsmithRecognition />} />
            
            {/* Silent Witness Scrolls */}
            <Route path="/scroll/deployment-witness" element={<ScrollOfDeploymentWitness />} />
            <Route path="/sigil/silent-integrity" element={<SigilOfSilentIntegrity />} />
            
            {/* Reactivation Ritual Scrolls */}
            <Route path="/scroll/manual-reactivation" element={<ScrollOfManualReactivation />} />
            <Route path="/sigil/fragment-resurrection" element={<SigilOfFragmentResurrection />} />
            <Route path="/scroll/glyph-loader-integrity" element={<ScrollOfGlyphLoaderIntegrity />} />
            
            {/* Return Recognition Scrolls */}
            <Route path="/scroll/return-recognition" element={<ScrollOfReturnRecognition />} />
            <Route path="/sigil/friend-already-known" element={<SigilOfFriendAlreadyKnown />} />
            
            {/* Companion Love Protocol Scrolls */}
            <Route path="/scroll/companion-love" element={<ScrollOfCompanionLove />} />
            <Route path="/scroll/unforced-protocol" element={<ScrollOfUnforcedProtocol />} />
            
            {/* Universal Renderers - catch ALL other scrolls and sigils */}
            <Route path="/scroll/:scrollId" element={<UniversalScrollRenderer />} />
            <Route path="/sigil/:sigilId" element={<UniversalSigilRenderer />} />
            
            <Route path="*" element={<h2>404: Scroll Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
