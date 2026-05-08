// DawnShield.jsx — /dawn-shield deep page on L0gic.io
// Day 202 (2026-05-05) draft by Lumen-Hemera at Patrick's direction.
// Mirrors D:/Dawn/staging/dawn-shield-launch-v0/README.md framing.
// Patrick's three pending README-decisions (covenant-sentence integration,
// dual-domain scope, sequencing) will reflect here in the same direction.

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Landing.css';
import './DawnShield.css';

export default function DawnShield() {
  return (
    <div className="landing-root">
      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="brand-link">
          <div className="brand">
            <span className="brand-mark">L0</span>
            <span className="brand-rest">gic.io</span>
          </div>
        </Link>
        <nav className="brand-nav">
          <Link to="/dawn-shield">Dawn Shield</Link>
          <Link to="/forensics">Forensics</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      {/* Page hero */}
      <section className="ds-hero">
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          DAWN SHIELD &middot; QUANTUM DEFENSE
        </motion.div>

        <motion.h1
          className="ds-headline"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Quantum-resistant defensive substrate
          <br />
          <span className="hero-headline-accent">for cryptographic data lifecycles.</span>
        </motion.h1>

        <motion.p
          className="ds-sub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          Hardware-validated post-quantum defense.
          <strong> 88&ndash;89% reduction in correct-secret-recovery</strong> on real
          IBM Quantum hardware (IBM Kingston, Day&nbsp;197 / 2026-04-29).
          Filed under U.S. Patent <strong>#19/537,449</strong> (NaN Lattice Defense).
          Companion patent <strong>#19/540,790</strong> (Self-Defending Additive Bus)
          covers the underlying compute substrate.
        </motion.p>

        <motion.p
          className="ds-covenant"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <em>
            The defense is architectural &mdash; forward-only additive primitives
            that reflect malformed input back without retaliating, treating
            safety as a property of the math rather than a policy layer.
          </em>
        </motion.p>
      </section>

      {/* What it does */}
      <section className="ds-section">
        <h2 className="ds-section-title">What it does</h2>
        <p className="ds-section-lede">
          Dawn Shield is a defensive primitive library that protects against
          three threat classes:
        </p>
        <div className="ds-threat-grid">
          <div className="ds-threat">
            <div className="ds-threat-tag">Threat Class 1</div>
            <h3 className="ds-threat-title">Gradient-channel poisoning</h3>
            <p>
              Adversarial gradient corruption during training. For backprop
              systems that must survive untrusted gradient sources.
            </p>
          </div>
          <div className="ds-threat">
            <div className="ds-threat-tag">Threat Class 2</div>
            <h3 className="ds-threat-title">Quantum-cryptographic compromise</h3>
            <p>
              Post-quantum decryption attempts against harvested ciphertext.
              Applies retroactive defense at the adversary&rsquo;s quantum
              execution time, not just at encryption time.
            </p>
          </div>
          <div className="ds-threat">
            <div className="ds-threat-tag">Threat Class 3</div>
            <h3 className="ds-threat-title">Substrate-level tampering</h3>
            <p>
              Runtime weight/state corruption detection via three-body
              checkpoint verification (CPU / iGPU / dGPU consensus).
            </p>
          </div>
        </div>
      </section>

      {/* Hardware-validated results */}
      <section className="ds-section ds-section-emph">
        <h2 className="ds-section-title">Hardware-validated results</h2>

        <div className="ds-result-card">
          <div className="ds-result-tag">QCEXE Layer 6 &mdash; IBM Kingston</div>
          <div className="ds-result-date">Day 197 / 2026-04-29</div>
          <ul className="ds-result-bullets">
            <li>Quantum Phase Estimation victim circuit, paired pristine vs. NaN-poisoned variants</li>
            <li><strong>92% correct output on pristine input.</strong> <strong>3% correct on poisoned input.</strong></li>
            <li>Net defense rate: <strong>88&ndash;89%</strong> across multiple test conditions</li>
            <li>Reproducible: IBM Quantum job IDs preserved in repository test artifacts</li>
            <li>Statistical significance: chi-squared p&lt;0.0001 across all conditions</li>
          </ul>
        </div>

        <div className="ds-result-card">
          <div className="ds-result-tag">NaN Lattice contagion test</div>
          <div className="ds-result-date">Day 152 / 2026-03-15</div>
          <ul className="ds-result-bullets">
            <li>Real IBM Quantum hardware (Kingston, Marrakesh, Fez, Torino backends)</li>
            <li><strong>72.7% NaN-contagion propagation rate</strong> against measurement-poisoned circuits</li>
            <li>Demonstrates NaN-typed signals propagate through quantum error-correction in ways classical-bit-flip signals do not</li>
          </ul>
        </div>

        <div className="ds-result-card">
          <div className="ds-result-tag">Adversarial test suite</div>
          <div className="ds-result-date">In-repo</div>
          <ul className="ds-result-bullets">
            <li>
              <strong>47/47 tests passing</strong> in <code>dawn-shield/tests/adversarial.rs</code>
              <span className="ds-pin"> (re-run pinned to launch day)</span>
            </li>
            <li>Multi-hardware validation harness covers CPU / iGPU / dGPU paths</li>
          </ul>
        </div>
      </section>

      {/* What it does NOT do */}
      <section className="ds-section">
        <h2 className="ds-section-title">What it does <em>not</em> do</h2>
        <ul className="ds-not-list">
          <li>
            <strong>Replace your transformer or training framework.</strong>
            Dawn Shield is a defensive layer, not a model.
          </li>
          <li>
            <strong>Provide cryptographic primitives you&rsquo;d use as a CSPRNG or KEM.</strong>
            Use NIST-standardized PQC (Kyber, Dilithium) for those.
            Dawn Shield composes <em>on top of</em> standard PQC.
          </li>
          <li>
            <strong>Replace formal cryptographic security proofs.</strong>
            The defenses are empirically validated; they are not formally proven.
          </li>
        </ul>
      </section>

      {/* License + Patent status */}
      <section className="ds-section ds-section-quiet">
        <div className="ds-twocol">
          <div>
            <h2 className="ds-section-title">License</h2>
            <p>
              <strong>Apache-2.0 with explicit patent grant.</strong>
              <br />
              <strong>FRAND licensed</strong> &mdash; fair, reasonable, and non-discriminatory access.
              <em> Conductance, not suppression.</em>
            </p>
            <p className="ds-license-note">
              The patent grant applies only to use consistent with the dawn-shield
              architectural intent (defensive substrate composition). Adversarial
              use &mdash; building a tool whose primary purpose is circumventing
              Dawn Shield in a system that relies on it &mdash; is not licensed.
            </p>
          </div>

          <div>
            <h2 className="ds-section-title">Status</h2>
            <ul className="ds-status-list">
              <li>
                <span className="ds-status-pill">FILED</span>
                Patent #19/537,449 &mdash; NaN Lattice Defense (Layers 2&ndash;4 covered)
              </li>
              <li>
                <span className="ds-status-pill ds-pill-prep">CIP in prep</span>
                Layer 1 Honey Coefficient + RF/Wireless Layer 5 + QCEXE Layer 6
              </li>
              <li>
                <span className="ds-status-pill ds-pill-process">In process</span>
                NIST PQC submission
              </li>
              <li>
                <span className="ds-status-pill">FILED</span>
                Patent #19/540,790 &mdash; Self-Defending Additive Bus
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ds-cta-section">
        <h2 className="ds-cta-title">Inquiries</h2>
        <p className="ds-cta-sub">
          For licensing, defense-prime engagement, NIST review collaboration,
          or research access to dawn-shield internals.
        </p>
        <div className="ds-cta-row">
          <a className="door-cta" href="mailto:patrickcrosby90@gmail.com?subject=Dawn%20Shield%20Inquiry">
            Request Brief &rarr;
          </a>
          <span className="ds-contact">
            patrickcrosby90@gmail.com &middot; Patrick James Crosby
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-row">
          <div>&copy; 2026 Patrick Crosby &middot; L0gic.io</div>
          <div className="footer-meta">
            FRAND Licensed &middot; Conductance, not suppression.
          </div>
        </div>
      </footer>
    </div>
  );
}
