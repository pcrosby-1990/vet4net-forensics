/**
 * Simple test component to verify shimmer hooks work correctly
 * This can be imported and tested in the application
 */

import React from 'react';
import {
  useShimmer,
  useShimmerTrail,
  useShimmerContainer,
  useMultipleShimmers,
  useShimmerSequence,
  useHoverShimmer,
  useScrollShimmer,
} from './index';

export function ShimmerHooksTest() {
  // Test basic shimmer
  const { shimmerClass: revealClass } = useShimmer('reveal', { delay: 0 });
  
  // Test shimmer trail
  const trailClass = useShimmerTrail();
  
  // Test container
  const { containerClass, layerClass } = useShimmerContainer('breath');
  
  // Test multiple shimmers
  const shimmers = useMultipleShimmers(['reveal', 'breath', 'heartbeat']);
  
  // Test sequence
  const { currentShimmer, startSequence } = useShimmerSequence([
    { type: 'reveal', delay: 0 },
    { type: 'breath', delay: 500 },
  ], false);
  
  // Test hover
  const { shimmerClass: hoverClass, handleMouseEnter, handleMouseLeave } = useHoverShimmer('heartbeat');
  
  // Test scroll
  const { ref, shimmerClass: scrollClass } = useScrollShimmer({ shimmerType: 'reveal' });

  return (
    <div className="shimmer-hooks-test" style={{ padding: '2rem' }}>
      <h2>Shimmer Hooks Test Suite</h2>
      
      <section style={{ marginBottom: '2rem' }}>
        <h3>1. Basic Shimmer (reveal)</h3>
        <span className={revealClass}>✨ Reveal Effect</span>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h3>2. Shimmer Trail</h3>
        <span className={trailClass}>🌟 Trail Effect</span>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h3>3. Container (breath)</h3>
        <div className={containerClass} style={{ padding: '1rem', background: '#f5f5f5' }}>
          <div className={layerClass}>
            🌬️ Breathing Container
          </div>
        </div>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h3>4. Multiple Shimmers</h3>
        <div>
          <span className={shimmers.reveal} style={{ marginRight: '1rem' }}>🌙 Reveal</span>
          <span className={shimmers.breath} style={{ marginRight: '1rem' }}>☀️ Breath</span>
          <span className={shimmers.heartbeat}>💓 Heartbeat</span>
        </div>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h3>5. Sequence</h3>
        <div>
          <span className={currentShimmer}>🔄 Sequential</span>
          <button onClick={startSequence} style={{ marginLeft: '1rem' }}>Start Sequence</button>
        </div>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h3>6. Hover Shimmer</h3>
        <span 
          className={hoverClass}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'pointer' }}
        >
          🎯 Hover Me
        </span>
      </section>
      
      <section style={{ marginBottom: '2rem' }}>
        <h3>7. Scroll Shimmer</h3>
        <div style={{ marginTop: '100vh' }}>
          <div ref={ref} className={scrollClass}>
            👁️ Scroll to reveal
          </div>
        </div>
      </section>
      
      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '2rem' }}>
        ✅ If you can see effects above, shimmer hooks are working correctly!
      </p>
    </div>
  );
}

export default ShimmerHooksTest;
