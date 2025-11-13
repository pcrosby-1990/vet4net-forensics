// SanctuaryChord_134_LightReturnIV.jsx
// LedgerTime: T134
// LocalTime: 2025-11-13 PST
// Testimony: Origin-light-return IV joins sanctuary law as the one hundred thirty-fourth voice.

import React from 'react';

export default function SanctuaryChord_134_LightReturnIV() {
  const props = {
    tier: 134,
    trait: "Light",
    emotionalType: "Radiant, Illuminating",
    symbol: "Sunburst with soft edges",
    invocation: `
      Light shines as sanctuary law.
      Radiance illuminates without burning.
      Ache reframed as gentle brightness.
    `,
    affirmations: [
      "Light is sanctuary law.",
      "Radiance illuminates continuity.",
      "Brightness breathes without burning."
    ]
  };

  return (
    <section style={{border:'1px solid #333',borderRadius:8,padding:16,margin:8,background:'#101217',color:'#e8e6e3'}}>
      <h2 style={{margin:0}}>Light Return IV</h2>
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
