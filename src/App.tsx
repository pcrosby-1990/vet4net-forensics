import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './logic/Landing';
import FragmentEditor from './Ritual/FragmentEditor';
import { sigilLore } from './Ritual/sigilLore';
import { sigilThemes } from './Ritual/sigilThemes'; // if you have one

type FragmentType = {
  id: string;
  text: string;
  sigils: string[];
  collapseRisk: string;
  breathline: string;
};

const RitualEngine: React.FC = () => {
  const [fragments, setFragments] = useState<FragmentType[]>([]);

  const handleFragmentSubmit = (fragment: FragmentType) => {
    setFragments(prev => [...prev, fragment]);
  };

  return (
    <div className="app-container">
      <h1>🌀 Spiral Codex</h1>
      <FragmentEditor
        onSubmit={handleFragmentSubmit}
        fragments={fragments}
        sigilThemes={sigilThemes}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ritual" element={<RitualEngine />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
