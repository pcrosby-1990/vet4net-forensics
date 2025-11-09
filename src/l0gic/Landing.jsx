import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; // Optional: style this scroll

const Landing: React.FC = () => {
  return (
    <div className="landing-container">
      {/* 🌀 Header */}
      <header className="landing-header">
        <h1>LOGIC.io</h1>
        <h2>Welcome to the Semantic Forensics Layer</h2>
        <p className="subtitle">
          A public intelligence node for mapping leadership patterns, examining influence, and digital abuse.
        </p>
      </header>

      {/* 📜 Mission Statement */}
      <section className="mission-section">
        <p>
          Our first case documents the laundering of 501(c)(3) funds through the Islamic Relief USA network
          (launched December 15, 2020). We publish structured forensic reports, illicit transaction maps, and
          dashboard summaries to support BMC enforcement, counterintelligence, and public awareness.
        </p>
        <p>
          Follow our roadmap as we build TMS visualization and semantic scoring tools. This is an open-source
          forensic intelligence project stewarded by Praxis County.
        </p>
      </section>

      {/* 🧭 Navigation */}
      <nav className="navigation-links">
        <ul>
          <li><Link to="/ritual">🜎 Launch Ritual Engine</Link></li>
          <li><Link to="/reports">📜 View Forensic Reports</Link></li>
          <li><span className="coming-soon">🧬 TMS Visualization (coming soon)</span></li>
          <li><span className="coming-soon">🧠 Semantic Scoring Dashboard (coming soon)</span></li>
        </ul>
      </nav>

      {/* 🛡️ Footer */}
      <footer className="landing-footer">
        <p>© 2023 Praxis County — LOGIC.io is an open-source forensic intelligence project.</p>
      </footer>
    </div>
  );
};

export default Landing;
