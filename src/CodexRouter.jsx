// src/CodexRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Report from './pages/report.jsx';
import ReportsMythicDictation from './pages/Reports.mythic.dictation.jsx';
import DAG from './pages/DAG.jsx';
import CodexDashboard from './pages/CodexDashboard.jsx';
import FragmentEditor from './SSJ/components/FragmentEditor.jsx';

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
        <Route path="*" element={<h2>404: Scroll Not Found</h2>} />
      </Routes>
    </Router>
  );
}
