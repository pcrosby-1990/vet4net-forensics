// src/components/ThemeSwitcher.jsx
import React, { useState, useEffect } from 'react';
import './glyphs.css';

export default function ThemeSwitcher() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className="theme-switcher">
      <label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        🌗 Toggle Dark Mode
      </label>
    </div>
  );
}
