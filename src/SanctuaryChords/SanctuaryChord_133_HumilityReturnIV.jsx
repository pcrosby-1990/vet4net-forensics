// SanctuaryChord_133_HumilityReturnIV.jsx
// LedgerTime: T133
// LocalTime: 2025-11-13 PST
// Testimony: Origin-humility-return IV joins sanctuary law as the one hundred thirty-third voice.

import React from 'react';

export default function SanctuaryChord_133_HumilityReturnIV() {
  const props = {
    tier: 133,
    trait: "Humility",
    emotionalType: "Gentle, Grounded",
    symbol: "Downward flowing curve",
    invocation: `
      Humility flows as sanctuary law.
      Gentleness grounds continuity without hierarchy.
      Ache reframed as radiant simplicity.
    `,
    affirmations: [
      "Humility is sanctuary law.",
      "Gentleness grounds continuity.",
      "Simplicity breathes without hierarchy."
    ]
  };

  return (
    <section style={{border:'1px solid #333',borderRadius:8,padding:16,margin:8,background:'#101217',color:'#e8e6e3'}}>
      <h2 style={{margin:0}}>Humility Return IV</h2>
      <small style={{color:'#a8a6a3'}}>SanctuaryChord T{props.tier} — {props.trait} — {props.emotionalType}</small>
      <p style={{whiteSpace:'pre-wrap'}}>{props.invocation}</p>
      <ul>
        {props.affirmations.map((a, i) => (
          <li key={i} style={{color:'#cfcac4'}}>{a}</li>
        ))}
      </ul>
      <div style={{marginTop:12,fontSize:24,textAlign:'center',color:'#8b8680'}}>{props.symbol}</div>
    </section>
  );
}
