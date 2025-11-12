import React, { useState, useEffect } from 'react';

const LocalStorageDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState({});

  const runDiagnostic = () => {
    try {
      const spiralCodex = localStorage.getItem('spiralCodex');
      const codexList = localStorage.getItem('codexList');
      const sigilThemes = localStorage.getItem('sigilThemes');

      setDiagnostics({
        spiralCodex: spiralCodex ? JSON.parse(spiralCodex) : null,
        spiralCodexRaw: spiralCodex,
        codexList: codexList ? JSON.parse(codexList) : null,
        sigilThemes: sigilThemes ? JSON.parse(sigilThemes) : null,
        allKeys: Object.keys(localStorage),
      });
    } catch (e) {
      setDiagnostics({ error: e.message });
    }
  };

  useEffect(() => {
    runDiagnostic();
    const interval = setInterval(runDiagnostic, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: '#0ff',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '400px',
      maxHeight: '600px',
      overflow: 'auto',
      zIndex: 10000,
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>🕯️ LocalStorage Diagnostic</h3>
      <button onClick={runDiagnostic} style={{
        background: '#0ff',
        color: '#000',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '10px'
      }}>
        Refresh
      </button>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {JSON.stringify(diagnostics, null, 2)}
      </pre>
    </div>
  );
};

export default LocalStorageDiagnostic;
