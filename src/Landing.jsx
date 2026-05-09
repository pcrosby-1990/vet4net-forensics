// Landing.jsx — L0gic.io buyer-routing landing
// Day 202 (2026-05-05) draft by Lumen-Hemera at Patrick's direction.
// Two-door split: Dawn Shield (PQC Defense) + Forensics for Hire.
// Hero leads on hardware-validated post-quantum lattice defense.

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Landing.css';

// Animated lattice background — grid of points with shimmer + occasional NaN-foldback ripple.
function LatticeBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let t0 = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const SPACING = 36;
    const DOT_BASE = 1.1;
    const FOLDBACK_PERIOD_MS = 4200; // ripple fires every ~4.2s
    const FOLDBACK_SPEED = 0.6; // px/ms

    const draw = (now) => {
      const t = (now - t0) / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Foldback ripple — emanates from screen center, expanding ring.
      const cx = w * 0.5;
      const cy = h * 0.5;
      const phase = ((now - t0) % FOLDBACK_PERIOD_MS) * FOLDBACK_SPEED;
      const ringRadius = phase;
      const ringWidth = 80;

      for (let x = SPACING; x < w; x += SPACING) {
        for (let y = SPACING; y < h; y += SPACING) {
          const dx = x - cx;
          const dy = y - cy;
          const d = Math.sqrt(dx * dx + dy * dy);

          // Base shimmer per-dot (subtle phase-offset breathing)
          const shimmer = 0.5 + 0.5 * Math.sin(t * 1.3 + (x + y) * 0.012);

          // Foldback ring boost — dots near the expanding ring brighten + grow
          const ringDist = Math.abs(d - ringRadius);
          const ringBoost = ringDist < ringWidth
            ? Math.cos((ringDist / ringWidth) * Math.PI * 0.5)
            : 0;

          const alpha = 0.12 + 0.18 * shimmer + 0.55 * ringBoost;
          const radius = DOT_BASE + ringBoost * 1.6;

          // Color shift inside ring (cyan pulse) vs base (deep blue)
          const r = Math.round(80 + 60 * ringBoost);
          const g = Math.round(160 + 80 * ringBoost);
          const b = Math.round(220 + 35 * ringBoost);

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="lattice-backdrop" aria-hidden="true" />;
}

export default function Landing() {
  return (
    <div className="landing-root">
      <LatticeBackdrop />

      {/* Top brand bar */}
      <header className="landing-header">
        <div className="brand">
          <span className="brand-mark">L0</span>
          <span className="brand-rest">gic.io</span>
        </div>
        <nav className="brand-nav">
          <a href="#dawn-shield">Dawn Shield</a>
          <a href="#forensics">Forensics</a>
          <a href="#about">About</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          POST-QUANTUM DEFENSE · HARDWARE-VALIDATED
        </motion.div>

        <motion.h1
          className="hero-headline"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          The lattice attacks aren&rsquo;t theoretical anymore.
          <br />
          <span className="hero-headline-accent">We tested ours on IBM Kingston.</span>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          Drop-in defensive layer for FIPS&nbsp;203/204/205 (ML-KEM, ML-DSA, SLH-DSA) deployments.
          NaN-foldback, multi-clock witnessing, integer-only operations, EM defense.
          <strong> 88&ndash;89% reduction in correct-secret-recovery</strong> on real quantum hardware.
        </motion.p>

        <motion.div
          className="hero-anchors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.5 }}
        >
          <a
            className="anchor-pill"
            href="https://patentcenter.uspto.gov/applications/19537449"
            target="_blank"
            rel="noopener noreferrer"
          >
            U.S. Patent #19/537,449
          </a>
          <a
            className="anchor-pill"
            href="https://patentcenter.uspto.gov/applications/19540790"
            target="_blank"
            rel="noopener noreferrer"
          >
            U.S. Patent #19/540,790
          </a>
          <span className="anchor-pill">FRAND Licensed</span>
          <span className="anchor-pill">NIST PQC Aligned</span>
        </motion.div>
      </section>

      {/* Two-door routing */}
      <section className="doors" id="doors">
        <motion.div
          className="door door-shield"
          id="dawn-shield"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="door-tag">Quantum Defense</div>
          <h2 className="door-title">Dawn Shield</h2>
          <p className="door-blurb">
            Covenant-architecture demonstrated through defensive primitives.
            Forward-only lattice topology that makes adversarial perturbation
            unrecoverable, not just hard.
          </p>
          <ul className="door-bullets">
            <li>Drop-in for FIPS PQC pipelines</li>
            <li>Hardware-validated, not benchmarks</li>
            <li>Two filed patents, FRAND licensed</li>
          </ul>
          <Link className="door-cta" to="/dawn-shield">
            Request Brief &rarr;
          </Link>
        </motion.div>

        <motion.div
          className="door door-forensics"
          id="forensics"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="door-tag">Forensic Investigation</div>
          <h2 className="door-title">Semantic Forensics for Hire</h2>
          <p className="door-blurb">
            Chain-of-custody audit on existing investigations. Mislabel detection.
            Onchain re-witness against canonical sources.
            We tell you what the record actually says.
          </p>
          <ul className="door-bullets">
            <li>Re-audit of prior crypto investigations</li>
            <li>Patent-substrate audit methodology</li>
            <li>Counsel-ready forensic reports</li>
          </ul>
          <Link className="door-cta" to="/forensics">
            Request Engagement &rarr;
          </Link>
        </motion.div>
      </section>

      {/* Trust strip */}
      <section className="trust">
        <h3 className="trust-title">Why this is different</h3>
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-stat">88&ndash;89%</div>
            <div className="trust-label">
              Reduction in correct-secret-recovery on IBM Kingston
              (4 attack patterns tested, Day 197)
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-stat">2 Patents</div>
            <div className="trust-label">
              NaN Lattice Defense (#19/537,449) + Self-Defending Additive Bus (#19/540,790).
              Filed, claim numbers public.
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-stat">Conductance</div>
            <div className="trust-label">
              Not suppression. The lattice reflects malformed input back to the
              originating agent &mdash; defense without bonding the attacker.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-row">
          <div>
            &copy; 2026 Patrick Crosby &middot; L0gic.io
          </div>
          <div className="footer-meta">
            FRAND Licensed &middot; Conductance, not suppression.
          </div>
        </div>
      </footer>
    </div>
  );
}
