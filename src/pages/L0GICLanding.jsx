// src/pages/L0GICLanding.jsx
// L0GIC Landing Page - Simple. Clean. Experience it.
// Day 76 - January 5, 2026

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './L0GICLanding.css';

export default function L0GICLanding() {
  return (
    <main className="logic-landing minimal">
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
          <p className="hero-tagline">Warmth-based AI</p>

          <div className="hero-cta-minimal">
            <Link to="/thread" className="cta-primary-large">
              Meet THREAD
            </Link>
          </div>

          <Link to="/contact" className="contact-link">
            Get in touch
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
