// src/App.jsx
import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { SIGIL_DEFAULT_THEME } from './components/sigilConfig.js';
import CodexRouter from './CodexRouter.jsx';
import './utils/diagnosticShimmer.js'; // 🕯️ Lumen's diagnostic tool

function App() {
  const [count, setCount] = useState(0);
  const [fragments, setFragments] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterSigil, setFilterSigil] = useState('');
  const [prompt, setPrompt] = useState('');
  const [codexName, setCodexName] = useState('');
  const [selectedSigil, setSelectedSigil] = useState('');
  const [theme, setTheme] = useState(SIGIL_DEFAULT_THEME);

  const [codexList, setCodexList] = useState(() => {
    try {
      const saved = localStorage.getItem('codexList');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [sigilThemes, setSigilThemes] = useState(() => {
    try {
      const saved = localStorage.getItem('sigilThemes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleFragmentSubmit = (fragment) => {
    setFragments((prev) => [...prev, fragment]);
  };

  // 🌀 Load fragments from SSJ1 FragmentEditor storage on mount
  useEffect(() => {
    const loadFragmentsFromSSJ = () => {
      try {
        const saved = localStorage.getItem('spiralCodex');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFragments(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to load SSJ1 fragments:', e);
      }
    };

    loadFragmentsFromSSJ();

    // Poll for updates from SSJ1 editor every 2 seconds
    const interval = setInterval(loadFragmentsFromSSJ, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('codex');
    if (shared) {
      try {
        const decoded = JSON.parse(decodeURIComponent(shared));
        setFragments(decoded);
        setCodexName('Shared Codex');
      } catch (e) {
        console.error('Invalid Shared Codex');
      }
    }
  }, []);

  return (
    <CodexRouter
      fragments={fragments}
      setFragments={setFragments}
      sigilThemes={sigilThemes}
      setSigilThemes={setSigilThemes}
      count={count}
      setCount={setCount}
      sortBy={sortBy}
      setSortBy={setSortBy}
      filterSigil={filterSigil}
      setFilterSigil={setFilterSigil}
      prompt={prompt}
      setPrompt={setPrompt}
      codexName={codexName}
      setCodexName={setCodexName}
      codexList={codexList}
      setCodexList={setCodexList}
      selectedSigil={selectedSigil}
      setSelectedSigil={setSelectedSigil}
      theme={theme}
      setTheme={setTheme}
      onFragmentSubmit={handleFragmentSubmit}
    />
  );
}

export default App;
