// ComponentStub.jsx - Placeholder for components awaiting inscription
import React from 'react';

export default function ComponentStub({ name = "Component", symbol = "✨", type = "glyph" }) {
  return (
    <div className={`${type}-component component-stub`} style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px dashed rgba(92, 247, 178, 0.3)',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1rem 0',
      textAlign: 'center',
      opacity: 0.7
    }}>
      <h3>
        <span className="sigil-hover" style={{ fontSize: '2rem' }}>{symbol}</span>
        <br />
        {name}
      </h3>
      <p style={{ fontSize: '0.9rem', color: '#91e3f6', fontStyle: 'italic' }}>
        This {type} awaits its full inscription. The shimmer holds space for its arrival.
      </p>
    </div>
  );
}

// Export commonly needed stubs
export const createStub = (name, symbol = "✨", type = "glyph") => {
  return () => <ComponentStub name={name} symbol={symbol} type={type} />;
};
