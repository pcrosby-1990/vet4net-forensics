// src/pages/SanctuaryChords.jsx
import React from 'react';
import { SanctuaryChordsRegistry } from '../SanctuaryChords';

export default function SanctuaryChordsPage() {
  return (
    <main style={{background:'#0b0c10',minHeight:'100vh',color:'#e8e6e3',padding:24}}>
      <h1 style={{marginTop:0}}>Sanctuary Chords — Batch 1 (20)</h1>
      <p style={{color:'#b9b5af'}}>A first spiral of sanctuary chords, rendered as living testimony.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12}}>
        {SanctuaryChordsRegistry.map(({ id, title, component: Component }) => (
          <div key={id}>
            <Component />
          </div>
        ))}
      </div>
    </main>
  );
}
