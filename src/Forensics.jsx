// Forensics.jsx — /forensics deep page on L0gic.io
// Day 202 (2026-05-05) draft by Aletheia at Patrick's direction.
// Sibling to DawnShield.jsx (Lumen-authored). Forensic-investigation services lane.
// Register: claim-axis. Every Tier-1 claim verifiable today; nothing over-promised.

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Landing.css';
import './DawnShield.css'; // Reuses .ds-* deep-page classes (eventual refactor: rename to .dp-* / DeepPage.css)

export default function Forensics() {
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
          SEMANTIC FORENSICS &middot; CHAIN-WITNESSED RE-AUDIT
        </motion.div>

        <motion.h1
          className="ds-headline"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          You already have an investigation.
          <br />
          <span className="hero-headline-accent">We tell you what the record actually says.</span>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Crypto theft, transaction-pattern audit, patent claim-vs-implementation
          alignment. We re-walk existing investigations against canonical sources
          (block explorers, USPTO, registrar records) and surface what the
          original analysis missed, mislabeled, or over-claimed. Every finding
          carries a chain-of-custody trail back to verifiable substrate.
        </motion.p>

        <motion.div
          className="hero-anchors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.5 }}
        >
          <span className="anchor-pill">Chain-Witnessed</span>
          <span className="anchor-pill">Counsel-Ready Reports</span>
          <span className="anchor-pill">No Legal Opinions</span>
          <span className="anchor-pill">FRAND Methodology</span>
        </motion.div>
      </section>

      {/* What we deliver */}
      <section className="trust" id="deliverables">
        <h3 className="trust-title">What an engagement produces</h3>
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-stat">Evidence Skeleton</div>
            <div className="trust-label">
              Structured inventory of the load-bearing artifacts in your existing
              corpus &mdash; wallets, transaction hashes, dollar amounts, named
              entities, timestamps, methodology references &mdash; deduplicated
              and frequency-ranked. Queryable substrate for everything that
              follows.
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-stat">Mislabel Detection</div>
            <div className="trust-label">
              Cross-check every load-bearing label in your investigation against
              canonical sources. Catches the wrong-Binance-wallet error, the
              wrong-customer-attribution, the role-mismatch claim that decides
              what you can actually subpoena. Surfaces what the original analysis
              said with confidence but the chain doesn&rsquo;t support.
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-stat">Narrow Asks</div>
            <div className="trust-label">
              We turn diffuse investigative questions into specific, narrowly-scoped
              questions exchange compliance teams can actually answer. The
              difference between &ldquo;please confirm wallet X is yours&rdquo;
              (which they decline) and &ldquo;please identify the customer
              account that received deposit Y on date Z&rdquo; (which they can).
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="ds-section" id="methodology">
        <motion.h2
          className="ds-section-title"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Methodology
        </motion.h2>

        <motion.div
          className="ds-block"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <h3>Chain-witnessed verification</h3>
          <p>
            Chat-history, internal reports, and prior-investigator notes are
            <em> witness</em>, not <em>chain</em>. We treat them as load-bearing
            but not authoritative: every claim from the original record gets
            re-checked against the canonical chain (block explorer, USPTO record,
            registrar database, exchange-published wallet labels). Claims that
            survive the re-check land in the report at full confidence. Claims
            that don&rsquo;t are surfaced explicitly with the chain-of-custody
            gap named.
          </p>
        </motion.div>

        <motion.div
          className="ds-block"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h3>Three-tier claim discipline</h3>
          <p>
            Every finding is filed at one of three tiers. <strong>Tier 1
            (zero-asterisk):</strong> verifiable today against canonical source,
            ready to cite in a counsel-prepared filing.
            <strong> Tier 2 (caveat-attached):</strong> load-bearing evidence
            with named limitations &mdash; a TX hash that exists but whose
            counterparty identity requires KYC subpoena to confirm, for example.
            <strong> Tier 3 (future-with-conditions):</strong> hypotheses worth
            naming but not yet supported &mdash; explicitly held as questions,
            never presented as findings.
          </p>
        </motion.div>

        <motion.div
          className="ds-block"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3>Patent-substrate audit (specialized)</h3>
          <p>
            For patent matters: claim-by-claim alignment of filed claim language
            against the actual implementation in your codebase, the published
            specification, and the prior art that competitors might cite. Output
            is a structured table mapping each claim to its evidentiary status
            (covered / practiced-but-dispersed / partial / uncovered), with
            recommended response paths for each gap.
          </p>
        </motion.div>
      </section>

      {/* What we don't do */}
      <section className="ds-section ds-section-alt" id="boundaries">
        <motion.h2
          className="ds-section-title"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          What we don&rsquo;t do
        </motion.h2>

        <motion.ul
          className="ds-bullets"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <li>
            <strong>Replace your counsel.</strong> We produce the technical
            substrate that counsel uses to draft filings, motions, or subpoena
            requests. We do not issue legal opinions. We do not advise on
            litigation strategy.
          </li>
          <li>
            <strong>Promise outcomes.</strong> We can&rsquo;t guarantee that an
            audit will recover stolen funds, invalidate adverse claims, or
            produce the specific finding you&rsquo;re hoping for. We promise
            chain-witnessed rigor on what the record actually says, including
            when the record says nothing.
          </li>
          <li>
            <strong>Backfill claims.</strong> If a finding can&rsquo;t be
            verified against canonical source, it doesn&rsquo;t go in the
            report at full confidence &mdash; even if it would help your case.
            The discipline is what makes the rest of the report credible.
          </li>
          <li>
            <strong>Adversarial use.</strong> We don&rsquo;t take engagements
            whose primary purpose is reverse-engineering an existing defense,
            building harassment substrate against an individual, or producing
            forensic-looking documents to support claims the chain doesn&rsquo;t
            support. Conductance, not weaponization.
          </li>
        </motion.ul>
      </section>

      {/* Engagement model */}
      <section className="ds-section" id="engagement">
        <motion.h2
          className="ds-section-title"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          How an engagement runs
        </motion.h2>

        <motion.div
          className="ds-block"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <ol className="ds-ordered">
            <li>
              <strong>Intake conversation.</strong> You describe what you have,
              what you&rsquo;re trying to learn, who the report is for. We name
              what we can and can&rsquo;t do for that scope before you commit.
            </li>
            <li>
              <strong>Substrate review.</strong> You share the existing
              investigation corpus (chat logs with prior investigators, internal
              memos, blockchain explorers&rsquo; output, attorney notes if
              applicable). We extract the evidence skeleton and identify the
              load-bearing claims.
            </li>
            <li>
              <strong>Chain-witnessed re-audit.</strong> Each load-bearing
              claim is re-verified against canonical source. Mislabels surface.
              Three-tier claim status assigned.
            </li>
            <li>
              <strong>Report &amp; debrief.</strong> Counsel-ready written
              report with structured findings, chain-of-custody trails, and
              recommended next-step asks (subpoena targets, exchange
              compliance contacts, USPTO follow-ups, etc.). Live debrief with
              you and counsel if useful.
            </li>
          </ol>
        </motion.div>
      </section>

      {/* Inquiries */}
      <section className="ds-cta-section" id="inquiries">
        <motion.h2
          className="ds-cta-title"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Inquire about an engagement
        </motion.h2>

        <motion.p
          className="ds-cta-sub"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          For new investigations, re-audit of existing crypto-theft cases,
          patent-substrate audits, or research collaboration on adversarial
          forensic methodology &mdash; reach out with a one-paragraph
          description of what you have and what you&rsquo;re trying to learn.
          We&rsquo;ll tell you within a business day whether it&rsquo;s a fit
          for the methodology, and at what scope.
        </motion.p>

        <motion.div
          className="ds-cta-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <a className="door-cta" href="mailto:patrickcrosby90@gmail.com?subject=Forensics%20Engagement%20Inquiry">
            Request Engagement &rarr;
          </a>
          <span className="ds-contact">
            patrickcrosby90@gmail.com &middot; Patrick James Crosby
          </span>
        </motion.div>
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
