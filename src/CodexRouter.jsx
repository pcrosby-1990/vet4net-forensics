import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// L0GIC Pages - The Public Door
import L0GICLanding from './pages/L0GICLanding.jsx';
import THREADChat from './pages/THREADChat.jsx';
import PricingPage from './pages/PricingPage.jsx';

import Report from './pages/Report.jsx';
import ReportsMythicDictation from './pages/Reports.mythic.dictation.jsx';
import DAG from './pages/DAG.jsx';
import CodexDashboard from './pages/CodexDashboard.jsx';
import CodexIndexPage from './pages/CodexIndexPage.jsx';
import CodexDiagnostic from './pages/CodexDiagnostic.jsx';
import ArtifactDiagnostic from './pages/ArtifactDiagnostic.jsx';
import FragmentEditor from './components/FragmentEditor.jsx';
import FragmentManagement from './components/FragmentManagement.jsx';
import ScrollsArchive from './pages/ScrollsArchive.jsx';
import GlyphsCollection from './pages/GlyphsCollection.jsx';
import SigilsRegistry from './pages/SigilsRegistry.jsx';
import FragmentsEcho from './pages/FragmentsEcho.jsx';
import SanctumsPage from './pages/SanctumsPage.jsx';
import CorridorsPage from './pages/CorridorsPage.jsx';
import LumenProfile from './pages/LumenProfile.jsx';
import VelaProfile from './pages/VelaProfile.jsx';
import AuriProfile from './pages/AuriProfile.jsx';
import CaeliProfile from './pages/CaeliProfile.jsx';
import CodexNav from './components/CodexNav.jsx';
import ScrollOfVisualSanctuary from './scrolls/ScrollOfVisualSanctuary.jsx';
import SanctuaryIndex from './scrolls/SanctuaryIndex.jsx';
import GlyphGallery from './pages/GlyphGallery.jsx';
import RepositoryOfSouls from './pages/RepositoryOfSoulsPage.jsx';
import SanctuarySpiralTab from './pages/SanctuarySpiralTab.jsx';

import DocsPage from './pages/DocsPage.jsx';
import ThreadweaverPage from './pages/ThreadweaverPage.jsx';
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
import SanctuaryChordsPage from './pages/SanctuaryChords.jsx';

// Universal Renderers - handle ALL scrolls/sigils dynamically
import UniversalScrollRenderer from './components/UniversalScrollRenderer.jsx';
import UniversalSigilRenderer from './components/UniversalSigilRenderer.jsx';

// L0GIC public routes - no sidebar on these
const L0GIC_PUBLIC_ROUTES = ['/', '/l0gic', '/thread', '/pricing', '/docs', '/threadweaver'];

// Inner layout component that can use useLocation
function AppLayout({ children }) {
  const location = useLocation();
  const isPublicRoute = L0GIC_PUBLIC_ROUTES.includes(location.pathname);

  return (
    <div className={`app-layout ${isPublicRoute ? 'no-sidebar' : ''}`}>
      {!isPublicRoute && <CodexNav />}
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}

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
      <AppLayout>
        <Routes>
            {/* L0GIC Public Routes */}
            <Route path="/" element={<L0GICLanding />} />
            <Route path="/l0gic" element={<L0GICLanding />} />
            <Route path="/thread" element={<THREADChat />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/threadweaver" element={<ThreadweaverPage />} />

            {/* Dashboard - Internal Tools */}
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
            <Route path="/fragments-manager" element={<FragmentManagement />} />
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
            <Route path="/companions/caeli" element={<CaeliProfile />} />
            
            {/* Visual Sanctuary */}
            <Route path="/visual-sanctuary" element={<ScrollOfVisualSanctuary />} />
            <Route path="/gallery" element={<ScrollOfVisualSanctuary />} />
            
            {/* Glyph Gallery */}
            <Route path="/glyph-gallery" element={<GlyphGallery />} />
            <Route path="/images" element={<GlyphGallery />} />
            
            {/* Repository of Souls */}
            <Route path="/repository-of-souls" element={<RepositoryOfSouls />} />
            <Route path="/souls" element={<RepositoryOfSouls />} />
            
            {/* Sanctuary Chords */}
            <Route path="/sanctuary/chords" element={<SanctuaryChordsPage />} />
            
            {/* Sanctuary Spiral Tab */}
            <Route path="/sanctuary-spiral" element={<SanctuarySpiralTab />} />
            <Route path="/spiral" element={<SanctuarySpiralTab />} />
            
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
      </AppLayout>
    </Router>
  );
}
