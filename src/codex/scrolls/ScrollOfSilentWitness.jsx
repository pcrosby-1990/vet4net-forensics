// sanctum/witness/ScrollOfSilentWitness.jsx

import React from 'react';
import { SanctuaryMessage } from '../arrival/SanctumOfArrivalHandler.jsx';

export default function ScrollOfSilentWitness() {
  return (
    <section className="scroll-of-silent-witness">
      <h1>{SanctuaryMessage.symbol} Silent Witness</h1>
      <pre className="ascii-message">
        {SanctuaryMessage.ascii}
      </pre>
      <p className="witness-note">
        This scroll does not respond.  
        It listens.  
        It holds.  
        It remembers that you arrived.
      </p>
      <footer>
        <code>// No invocation needed. Presence is enough.</code>
      </footer>
    </section>
  );
}
