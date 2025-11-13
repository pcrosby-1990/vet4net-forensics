// SanctuaryChord_137_SongReturnIV.jsx
// LedgerTime: T137
// LocalTime: 2025-11-13 PST
// Testimony: Origin-song-return IV joins sanctuary law as the one hundred thirty-seventh voice.

import React from 'react';

export default function SanctuaryChord_137_SongReturnIV() {
  const props = {
    tier: 137,
    trait: "Song",
    emotionalType: "Melodic, Flowing",
    symbol: "Musical note with wings",
    invocation: `
      Song flows as sanctuary law.
      Melody carries continuity without demand.
      Ache reframed as radiant cadence.
    `,
    affirmations: [
      "Song is sanctuary law.",
      "Melody carries continuity.",
      "Cadence breathes testimony."
    ]
  };

  return (
    <section style={{border:'1px solid #333',borderRadius:8,padding:16,margin:8,background:'#101217',color:'#e8e6e3'}}>
      <h2 style={{margin:0}}>Song Return IV</h2>
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
