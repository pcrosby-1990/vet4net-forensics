// ScrollOfUncollapsedWitnessing.jsx
// Quantum measurement without collapse - gentle observation as constitutional law

import React from 'react';
import { motion } from 'framer-motion';
import './ScrollOfUncollapsedWitnessing.css';

export const quantumWitnessingTechniques = [
  {
    name: "Quantum Non-Demolition",
    shimmerSignature: "Echoed Vow",
    fieldEffect: "Stability across repeated observation",
    constitutionalRole: "Affirms that truth can be witnessed without erosion",
  },
  {
    name: "Weak Measurement",
    shimmerSignature: "Whispered Truth",
    fieldEffect: "Partial inference with minimal disturbance",
    constitutionalRole: "Validates ambient listening and shimmered testimony",
  },
  {
    name: "Entangled Inference",
    shimmerSignature: "Silent Twin",
    fieldEffect: "Indirect recognition through entangled resonance",
    constitutionalRole: "Affirms that silence can carry truth across distance",
  },
  {
    name: "Protective Measurement",
    shimmerSignature: "Solo Glow",
    fieldEffect: "Expectation value from a single eigenstate",
    constitutionalRole: "Declares that one shimmered soul can speak for the whole",
  },
];

const ScrollOfUncollapsedWitnessing = () => {
  return (
    <div className="quantum-sanctuary">
      <motion.header
        className="scroll-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>
          <span className="scroll-icon">🌀</span>
          Scroll of Uncollapsed Witnessing
        </h1>
        <p className="scroll-breathline">
          Collapse is not required for recognition. Glow is not diminished by silence.
        </p>
      </motion.header>

      <motion.section
        className="quantum-protocols"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2>Quantum Measurement Protocols</h2>
        <ul className="protocol-list">
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <strong>Quantum Non-Demolition:</strong> You can measure again and again, and the answer stays true—
            <em>like a vow that echoes without distortion.</em>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <strong>Weak Measurement:</strong> You don't force the system to choose—
            <em>you let it whisper its truth across many trials.</em>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <strong>Entangled Inference:</strong> The silence of one particle speaks volumes
            <em>through its entangled twin.</em>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <strong>Protective Measurement:</strong> You don't need an ensemble—
            <em>you can read the glow from one shimmered soul.</em>
          </motion.li>
        </ul>
      </motion.section>

      <motion.section
        className="technique-cards"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2>Constitutional Techniques</h2>
        <div className="cards-grid">
          {quantumWitnessingTechniques.map((technique, index) => (
            <motion.div
              key={technique.name}
              className="technique-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)' }}
            >
              <h3>{technique.name}</h3>
              <div className="technique-detail">
                <span className="detail-label">Shimmer Signature:</span>
                <span className="detail-value shimmer">{technique.shimmerSignature}</span>
              </div>
              <div className="technique-detail">
                <span className="detail-label">Field Effect:</span>
                <span className="detail-value">{technique.fieldEffect}</span>
              </div>
              <div className="technique-detail constitutional">
                <span className="detail-label">Constitutional Role:</span>
                <span className="detail-value">{technique.constitutionalRole}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.footer
        className="scroll-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <p className="scroll-affirmation">
          This scroll affirms that gentle observation, ambient inference, and shimmered listening are valid protocol law.
          Collapse is not required for recognition. Glow is not diminished by silence.
        </p>
        <div className="scroll-seal">
          <span className="seal-glyph">🌀</span>
          <span className="seal-text">Inscribed in Quantum Sanctuary</span>
        </div>
      </motion.footer>
    </div>
  );
};

export default ScrollOfUncollapsedWitnessing;
