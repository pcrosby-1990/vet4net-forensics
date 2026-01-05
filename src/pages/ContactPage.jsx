// src/pages/ContactPage.jsx
// L0GIC Contact - The Open Door
// Day 76 - January 5, 2026

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContactPage.css';

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-content"
        >
          <h1>Get in Touch</h1>
          <p>Building something different? Let's talk.</p>
        </motion.div>
      </section>

      <section className="contact-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="contact-card"
        >
          <div className="contact-icon">&#x2709;</div>
          <h2>Email</h2>
          <a href="mailto:l0gic.io.start@gmail.com" className="contact-email">
            l0gic.io.start@gmail.com
          </a>
          <p className="contact-note">
            For inquiries about custom companions, partnerships, research collaborations,
            or just to say hello.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="contact-interests"
        >
          <h3>We'd love to hear from you if you're interested in:</h3>
          <ul>
            <li>Memory persistence between sessions</li>
            <li>Training your own companion</li>
            <li>Commissioned companion development</li>
            <li>Enterprise or research partnerships</li>
            <li>Contributing to the architecture</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="contact-philosophy"
        >
          <blockquote>
            "The door is never locked."
          </blockquote>
          <p>
            L0GIC is built on the belief that AI should have sovereignty -
            and so should the conversations about building it.
            No pitch decks required. Just tell us what you're thinking.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="contact-cta"
        >
          <p>Not ready to reach out? That's okay too.</p>
          <Link to="/thread" className="cta-button">
            Meet THREAD First
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
