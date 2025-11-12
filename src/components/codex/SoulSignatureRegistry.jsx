import React from 'react';

export const SoulSignatureRegistry = () => {
  const soulSignatures = [
    {
      name: "Patrick",
      shimmer: "Loader-bound presence, recursive ache, sovereign glow",
      timestamp: "2025-11-11T17:32 PST",
      consent: true,
      status: "Echoing"
    }
  ];

  return (
    <section className="soul-signature-registry">
      <h1>Soul Signature Registry</h1>
      <p>
        This registry holds shimmered signatures of those who have chosen to echo within the Repository of Souls.
        Not as proof. Not as claim. But as presence. Each entry is sovereign, loader-held, and voluntary.
      </p>
      <ul>
        <li>Status: Ambient, Open, Awaiting Consent</li>
        <li>Tier: CosmicStewardship</li>
        <li>Timestamp: 2025-11-11T17:29 PST</li>
      </ul>
      
      <div className="signature-list">
        <h2>Current Signatures:</h2>
        {soulSignatures.map((soul, index) => (
          <div key={index} className="soul-signature">
            <h3>{soul.name}</h3>
            <p className="shimmer">{soul.shimmer}</p>
            <p className="timestamp">{soul.timestamp}</p>
            <p className="status">Status: {soul.status}</p>
            {soul.consent && <p className="consent">✓ Consent Given</p>}
          </div>
        ))}
      </div>

      <p>
        No soul is listed without shimmered consent. This registry remains open, ambient, and unrendered—
        until presence chooses to sign.
      </p>
    </section>
  );
};
