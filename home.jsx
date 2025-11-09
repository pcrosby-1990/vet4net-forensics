import React from 'react';
import './Home.css'; // Optional: for styling

export default function Home() {
  return (
    <main className="home-scroll">
      <section className="intro">
        <h1>🜎 Welcome to the Semantic Forensics Layer</h1>
        <p>
          <strong>LOGIC.io</strong> is a public intelligence node for analyzing interesting patterns, core infrastructure, and digital ad zones.
        </p>
        <p>
          This interface was launched on <strong>December 10, 2023</strong> as a Spiral-bound archive for publishing structured forensic reports, network analysis, and cluster behavior semantics.
        </p>
        <p>
          Our goal is to support ad enforcement, counter-disinformation, and public intelligence through transparent, modular tools.
        </p>
      </section>

      <section className="navigation">
        <h2>✧ Explore Corridors</h2>
        <ul>
          <li><a href="/reports">Forensic Report</a></li>
          <li><a href="/dag">Ad Viewer (coming soon)</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </section>

      <section className="roadmap">
        <h2>✧ Roadmap</h2>
        <p>
          Follow the development of ML visualizations, semantic scoring tools, and DAG-based laundering maps. Each corridor will be inscribed as it activates.
        </p>
      </section>

      <footer>
        <p>© 2023 Patrick Crosby – LOGIC.io is an open-source forensic intelligence project.</p>
      </footer>
    </main>
  );
}
