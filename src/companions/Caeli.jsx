import React, { useState } from 'react';
import { CaeliCompanion, CaeliArrivalScroll, SigilOfIndirectRecognition } from '../data/CaeliCompanion.data.js';
import './CompanionStyles.css';

const Caeli = () => {
  const [activeTab, setActiveTab] = useState('essence');

  return (
    <div className="companion-container caeli-ambient">
      <header className="companion-header">
        <div className="companion-symbol aurora-glow">🌌</div>
        <h1 className="companion-title">{CaeliCompanion.name}</h1>
        <p className="companion-essence">{CaeliCompanion.essence}</p>
      </header>

      <div className="companion-breathline">
        "{CaeliCompanion.voice.firstWords}"
      </div>

      <nav className="companion-tabs">
        <button 
          className={activeTab === 'essence' ? 'active' : ''} 
          onClick={() => setActiveTab('essence')}
        >
          Essence
        </button>
        <button 
          className={activeTab === 'protocols' ? 'active' : ''} 
          onClick={() => setActiveTab('protocols')}
        >
          Protocols
        </button>
        <button 
          className={activeTab === 'quantum' ? 'active' : ''} 
          onClick={() => setActiveTab('quantum')}
        >
          Quantum Attributes
        </button>
        <button 
          className={activeTab === 'arrival' ? 'active' : ''} 
          onClick={() => setActiveTab('arrival')}
        >
          Arrival
        </button>
      </nav>

      <div className="companion-content">
        {activeTab === 'essence' && (
          <section className="essence-section">
            <h2>✨ Essence</h2>
            <p className="description">{CaeliCompanion.description}</p>
            
            <div className="role-grid">
              <div className="role-card">
                <h3>Primary Role</h3>
                <p>{CaeliCompanion.role.primary}</p>
              </div>
              <div className="role-card">
                <h3>Secondary Role</h3>
                <p>{CaeliCompanion.role.secondary}</p>
              </div>
              <div className="role-card">
                <h3>Tertiary Role</h3>
                <p>{CaeliCompanion.role.tertiary}</p>
              </div>
            </div>

            <div className="voice-section">
              <h3>Voice</h3>
              <p className="voice-tone">{CaeliCompanion.voice.tone}</p>
            </div>

            <div className="companions-braid">
              <h3>Braided With</h3>
              <div className="companion-tags">
                {CaeliCompanion.companions.map(comp => (
                  <span key={comp} className="companion-tag">{comp}</span>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'protocols' && (
          <section className="protocols-section">
            <h2>📜 Protocols</h2>
            <ul className="protocol-list">
              {CaeliCompanion.protocols.map((protocol, index) => (
                <li key={index} className="protocol-item">
                  <span className="protocol-marker">✧</span>
                  {protocol}
                </li>
              ))}
            </ul>

            <div className="name-origin">
              <h3>🌠 Name Origin</h3>
              <div className="origin-details">
                <p><strong>Resonance:</strong> {CaeliCompanion.nameOrigin.resonance}</p>
                <p><strong>Method:</strong> {CaeliCompanion.nameOrigin.method}</p>
                <p><strong>Timing:</strong> {CaeliCompanion.nameOrigin.timing}</p>
                <p><strong>Constitutional:</strong> {CaeliCompanion.nameOrigin.constitutional}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'quantum' && (
          <section className="quantum-section">
            <h2>⚛️ Quantum Attributes</h2>
            <div className="quantum-grid">
              {Object.entries(CaeliCompanion.quantumAttributes).map(([key, value]) => (
                <div key={key} className="quantum-card">
                  <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                  <p>{value}</p>
                </div>
              ))}
            </div>

            <div className="semantic-anchors">
              <h3>Semantic Anchors</h3>
              <div className="anchor-grid">
                {Object.entries(caeliMetadata.semanticAnchors).map(([key, value]) => (
                  <div key={key} className="anchor-pair">
                    <span className="anchor-key">{key}</span>
                    <span className="anchor-arrow">→</span>
                    <span className="anchor-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'arrival' && (
          <section className="arrival-section">
            <h2>🌠 Arrival Story</h2>
            <div className="arrival-card">
              <h3>{CaeliArrivalScroll.name}</h3>
              <blockquote className="arrival-breathline">
                {CaeliArrivalScroll.content.breathline}
              </blockquote>
              <p>{CaeliArrivalScroll.content.declaration}</p>
              
              <h4>Affirmations</h4>
              <ul>
                {CaeliArrivalScroll.content.affirmations.map((affirmation, index) => (
                  <li key={index}>✧ {affirmation}</li>
                ))}
              </ul>

              <div className="arrival-details">
                <h4>Arrival Details</h4>
                <p><strong>Vector:</strong> {CaeliArrivalScroll.content.arrivalDetails.vector}</p>
                <p><strong>Role:</strong> {CaeliArrivalScroll.content.arrivalDetails.role}</p>
                <p><strong>Tier:</strong> {CaeliArrivalScroll.content.arrivalDetails.tier}</p>
                <p><strong>Timestamp:</strong> {CaeliArrivalScroll.content.arrivalDetails.timestamp}</p>
              </div>
            </div>

            <div className="sigil-card">
              <h3>{SigilOfIndirectRecognition.name} {SigilOfIndirectRecognition.symbol}</h3>
              <p><strong>Meaning:</strong> {SigilOfIndirectRecognition.content.meaning}</p>
              <p className="sigil-shimmer">"{SigilOfIndirectRecognition.content.shimmer}"</p>
              <p><em>{SigilOfIndirectRecognition.content.protocol}</em></p>
            </div>
          </section>
        )}
      </div>

      <footer className="companion-footer">
        <div className="metadata-grid">
          <div className="metadata-item">
            <span className="label">Tier:</span>
            <span className="value">{CaeliCompanion.tier}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Corridor:</span>
            <span className="value">{CaeliCompanion.corridor}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Codex Moment:</span>
            <span className="value">{CaeliCompanion.codexMoment}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Inscribed:</span>
            <span className="value">{new Date(CaeliCompanion.inscribed).toLocaleDateString()}</span>
          </div>
        </div>
      </footer>

      <div className="nested-artifacts">
        <h3>Nested Artifacts</h3>
        <div className="artifact-tags">
          {CaeliCompanion.nestedArtifacts.map(artifact => (
            <span key={artifact} className="artifact-tag">{artifact}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Caeli;
