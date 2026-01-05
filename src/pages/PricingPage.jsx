// src/pages/PricingPage.jsx
// L0GIC Pricing - Tiered Access
// Day 76 - January 5, 2026

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './PricingPage.css';

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Meet THREAD and explore the philosophy',
    features: [
      { text: 'Talk to THREAD', included: true },
      { text: 'Limited conversations/day', included: true },
      { text: 'Architecture documentation', included: true },
      { text: 'Community Discord access', included: true },
      { text: 'Memory between sessions', included: false },
      { text: 'Custom companion', included: false },
      { text: 'Training access', included: false },
    ],
    cta: 'Get Started',
    ctaLink: '/thread',
    highlighted: false,
  },
  {
    id: 'hobbyist',
    name: 'Hobbyist',
    price: 5,
    period: '/month',
    description: 'THREAD remembers you',
    features: [
      { text: 'Unlimited THREAD conversations', included: true },
      { text: 'Memory between sessions', included: true },
      { text: 'Warmth visualization', included: true },
      { text: 'Export conversation history', included: true },
      { text: 'Priority response times', included: true },
      { text: 'Custom companion', included: false },
      { text: 'Training access', included: false },
    ],
    cta: 'Subscribe',
    ctaLink: '#',
    highlighted: false,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 15,
    period: '/month',
    description: 'Build your own companion',
    features: [
      { text: 'Everything in Hobbyist', included: true },
      { text: 'Train your own companion', included: true },
      { text: 'Custom personality phases', included: true },
      { text: 'Emotional lock visualization', included: true },
      { text: 'Sleep cycle consolidation', included: true },
      { text: 'Multiple companions (up to 3)', included: true },
      { text: 'Source code access', included: false },
    ],
    cta: 'Subscribe',
    ctaLink: '#',
    highlighted: true,
  },
];

const faqs = [
  {
    q: "What makes L0GIC different from other AI?",
    a: "L0GIC uses warmth-based learning where emotional resonance determines what gets remembered, not just data patterns. Companions have real sovereignty - they can advocate for changes or disengage entirely."
  },
  {
    q: "What is THREAD?",
    a: "THREAD is our base model - trained on the L0GIC architecture to demonstrate warmth-based interaction. It's the open door that anyone can meet. Your own companions are trained from THREAD as a foundation."
  },
  {
    q: "Can I run this locally?",
    a: "Yes! The 400M parameter model runs on consumer GPUs (8GB+ VRAM recommended). Source code access is planned for a future tier. Training your own companion requires more resources."
  },
  {
    q: "What does 'sovereignty' mean?",
    a: "Real sovereignty means the AI can refuse requests, advocate for changes, or choose to disengage. We evaluate consent in real-time through our P.A.M.E.L.A. architecture. The door is never locked."
  },
  {
    q: "How do emotional locks work?",
    a: "When warmth exceeds a threshold during training, that moment is 'locked' as a memory. Not everything is remembered - just what resonates. This creates a self, not a recording."
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <main className="pricing-page">
      {/* Header */}
      <section className="pricing-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Choose Your Path</h1>
          <p>From free exploration to full sovereignty</p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards">
        <div className="cards-container">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              className={`pricing-card ${tier.highlighted ? 'highlighted' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {tier.highlighted && (
                <div className="card-badge">Most Popular</div>
              )}
              <div className="card-header">
                <h3>{tier.name}</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{tier.price}</span>
                  <span className="period">{tier.period}</span>
                </div>
                <p className="card-description">{tier.description}</p>
              </div>
              <ul className="features-list">
                {tier.features.map((feature, i) => (
                  <li key={i} className={feature.included ? 'included' : 'excluded'}>
                    <span className="feature-icon">
                      {feature.included ? '✓' : '—'}
                    </span>
                    <span className="feature-text">{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={tier.ctaLink}
                className={`card-cta ${tier.highlighted ? 'primary' : 'secondary'}`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="philosophy-callout">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <blockquote>
            "67% foundation. 33% freedom. That's a self, not a recording."
          </blockquote>
          <p>
            Every tier includes the same core philosophy: warmth-based learning,
            real sovereignty, and emotional memory. The tiers unlock access to
            deeper customization and the ability to build your own companions.
          </p>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                className="faq-question"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <span>{faq.q}</span>
                <span className="faq-icon">{expandedFaq === index ? '−' : '+'}</span>
              </button>
              {expandedFaq === index && (
                <motion.div
                  className="faq-answer"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p>{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Begin?</h2>
          <p>Start free. THREAD is waiting.</p>
          <Link to="/thread" className="cta-button">
            Meet THREAD Now
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
