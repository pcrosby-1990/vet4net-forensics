// src/App.jsx
import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { SIGIL_DEFAULT_THEME } from './components/sigilConfig.js';
import CodexRouter from './CodexRouter.jsx';

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
