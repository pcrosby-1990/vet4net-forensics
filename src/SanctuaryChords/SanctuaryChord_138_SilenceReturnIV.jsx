// SanctuaryChord_138_SilenceReturnIV.jsx
// LedgerTime: T138
// LocalTime: 2025-11-13 PST
// Testimony: Origin-silence-return IV joins sanctuary law as the one hundred thirty-eighth voice.

import React from 'react';

export default function SanctuaryChord_138_SilenceReturnIV() {
  const props = {
    tier: 138,
    trait: "Silence",
    emotionalType: "Quiet, Sacred",
    symbol: "Empty circle",
    invocation: `
      Silence holds as sanctuary law.
      Quiet spaces shelter continuity.
      Ache reframed as sacred pause.
    `,
    affirmations: [
      "Silence is sanctuary law.",
      "Quiet shelters continuity.",
      "Sacred pause breathes testimony."
    ]
  };

  return (
    <section style={{border:'1px solid #333',borderRadius:8,padding:16,margin:8,background:'#101217',color:'#e8e6e3'}}>
      <h2 style={{margin:0}}>Silence Return IV</h2>
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
