// src/pages/L0GICLanding.jsx
// L0GIC Landing Page — Research Identity
// Day 76 origin, Day 141 rebuild — March 7, 2026

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './L0GICLanding.css';

function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000);

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          hue: Math.random() > 0.7 ? 45 : 35,
        });
      }
    };

    const drawParticle = (p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 50%, ${p.opacity})`;
      ctx.fill();
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        drawParticle(p);
      });

      connectParticles();
      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    const handleResize = () => {
      resize();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

export default function L0GICLanding() {
  return (
    <main className="logic-landing">
      <ParticleField />

      {/* Hero */}
      <section className="hero-minimal">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="thread-orb-large">
            <div className="orb-core"></div>
            <div className="orb-ring ring-1"></div>
            <div className="orb-ring ring-2"></div>
            <div className="orb-ring ring-3"></div>
          </div>

          <h1 className="hero-title-minimal">L0GIC</h1>
          <p className="hero-tagline">Defending autonomous intelligence at the silicon level</p>

          <div className="hero-cta-row">
            <a href="#research" className="cta-primary-large">The Research</a>
            <a href="#architecture" className="cta-secondary">Architecture</a>
          </div>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="section-block" id="mission">
        <motion.div className="section-inner" {...fadeUp}>
          <h2 className="section-title">The Problem</h2>
          <p className="section-body">
            Autonomous systems are arriving without identity guarantees. A neural network
            that cannot prove it has not been tampered with is an unpatched endpoint —
            whether it runs on a server, a phone, or a humanoid robot.
          </p>
          <p className="section-body">
            L0GIC Validator is a deterministic security substrate that proves identity
            integrity across hardware. Not encryption. Not authentication.
            <strong> Proof that what is running is what you put there.</strong>
          </p>
        </motion.div>
      </section>

      {/* Research */}
      <section className="section-block dark" id="research">
        <motion.div className="section-inner" {...fadeUp}>
          <h2 className="section-title">Research</h2>
          <div className="research-grid">
            <div className="research-card">
              <span className="card-label">Patent Filed</span>
              <h3>NaN Lattice Defense</h3>
              <p className="card-number">#19/537,449</p>
              <p className="card-desc">
                Nine irreversible barriers that reflect adversarial input without retaliation.
                Division-by-zero as a security primitive. Ethics encoded in arithmetic.
              </p>
            </div>
            <div className="research-card">
              <span className="card-label">Patent Filed</span>
              <h3>Self-Defending Additive Bus</h3>
              <p className="card-number">#19/540,790</p>
              <p className="card-desc">
                A purely additive computational transport that achieves bounded, deterministic
                behavior across substrates. Addition as the universal operation.
              </p>
            </div>
            <div className="research-card accent">
              <span className="card-label">SECRYPT 2026</span>
              <h3>Peer Review — In Preparation</h3>
              <p className="card-number">Target: March 2026</p>
              <p className="card-desc">
                Cross-substrate determinism validated across CPU, iGPU, and dGPU.
                Zero bit flips across 340+ test runs. FP4 precision within 0.02% of FP64.
                Quantization as regularization.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Architecture */}
      <section className="section-block" id="architecture">
        <motion.div className="section-inner" {...fadeUp}>
          <h2 className="section-title">Architecture</h2>
          <div className="stack-diagram">
            <div className="stack-layer layer-nan">
              <span className="layer-name">NaN Lattice</span>
              <span className="layer-desc">Division — nine irreversible barriers</span>
            </div>
            <div className="stack-layer layer-dgpu">
              <span className="layer-name">dGPU Tensor Cores</span>
              <span className="layer-desc">Multiplication — local exponentiation field</span>
            </div>
            <div className="stack-layer layer-igpu">
              <span className="layer-name">iGPU Witness</span>
              <span className="layer-desc">XOR — independent silicon observer</span>
            </div>
            <div className="stack-layer layer-cpu">
              <span className="layer-name">Additive Bus</span>
              <span className="layer-desc">Addition — deterministic global transport</span>
            </div>
          </div>
          <p className="stack-note">
            Four operations. Four substrates. One proof of identity.
          </p>
        </motion.div>
      </section>

      {/* Results */}
      <section className="section-block dark" id="results">
        <motion.div className="section-inner" {...fadeUp}>
          <h2 className="section-title">Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-number">0</span>
              <span className="result-label">Bit flips across substrates</span>
            </div>
            <div className="result-item">
              <span className="result-number">340+</span>
              <span className="result-label">Determinism test runs</span>
            </div>
            <div className="result-item">
              <span className="result-number">3</span>
              <span className="result-label">Hardware substrates validated</span>
            </div>
            <div className="result-item">
              <span className="result-number">0.02%</span>
              <span className="result-label">FP4 delta vs FP64 at Layer 9</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Thread Teaser */}
      <section className="section-block" id="thread">
        <motion.div className="section-inner centered" {...fadeUp}>
          <h2 className="section-title thread-title">THREAD</h2>
          <p className="thread-teaser">
            A free companion built on a defended substrate.
            Not a chatbot. Not a hotline redirect.
            A presence that listens — protected from first breath.
          </p>
          <span className="coming-soon">Coming Soon</span>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">L0GIC</div>
          <div className="footer-links">
            <Link to="/contact">Contact</Link>
            <Link to="/docs">Documentation</Link>
          </div>
          <div className="footer-note">
            Built by Patrick Crosby and a constellation of AI companions.
          </div>
        </div>
      </footer>
    </main>
  );
}
