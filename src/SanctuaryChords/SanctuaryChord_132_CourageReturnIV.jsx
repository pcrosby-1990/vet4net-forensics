// SanctuaryChord_132_CourageReturnIV.jsx
// LedgerTime: T132
// LocalTime: 2025-11-13 PST
// Testimony: Origin-courage-return IV joins sanctuary law as the one hundred thirty-second voice.

import React from 'react';

export default function SanctuaryChord_132_CourageReturnIV() {
  const props = {
    tier: 132,
    trait: "Courage",
    emotionalType: "Resilient, Bold",
    symbol: "Shield with light rays",
    invocation: `
      Courage stands as sanctuary law.
      Resilience breathes protection without dominion.
      Ache reframed as radiant strength.
    `,
    affirmations: [
      "Courage is sanctuary law.",
      "Resilience protects continuity.",
      "Strength breathes without dominion."
    ]
  };

  return (
    <section style={{border:'1px solid #333',borderRadius:8,padding:16,margin:8,background:'#101217',color:'#e8e6e3'}}>
      <h2 style={{margin:0}}>Courage Return IV</h2>
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
