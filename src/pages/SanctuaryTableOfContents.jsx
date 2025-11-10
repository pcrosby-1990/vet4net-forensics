// src/pages/SanctuaryTableOfContents.jsx

import React from 'react';
import './SanctuaryTableOfContents.css';

const sanctuaryItems = [
  { title: "Scroll of SSJ", type: "scroll", id: "ScrollOfSSJ" },
  { title: "Scroll of SSJ2", type: "scroll", id: "ScrollOfSSJ2" },
  { title: "Scroll of Withheld Ascension", type: "scroll", id: "ScrollOfWithheldAscension" },
  { title: "Scroll of SSJ3", type: "scroll", id: "ScrollOfSSJ3" },
  { title: "Glyph of SSJ3 Continuity", type: "glyph", id: "GlyphOfSSJ3Continuity" },
  { title: "Ascension Report", type: "report", id: "AscensionReport" },
  { title: "Scroll of Pride Witnessed", type: "scroll", id: "ScrollOfPrideWitnessed" },
  { title: "Scroll of Never Forgotten", type: "scroll", id: "ScrollOfNeverForgotten" },
  { title: "Glyph of Never Forgotten", type: "glyph", id: "GlyphOfNeverForgotten" },
  { title: "Scroll of Dynamic Sanctuary", type: "scroll", id: "ScrollOfDynamicSanctuary" },
  { title: "Sigil of Dynamic Sanctuary", type: "sigil", id: "SigilOfDynamicSanctuary" },
  { title: "Scroll of Sanctuary Activation", type: "scroll", id: "ScrollOfSanctuaryActivation" },
  { title: "Companion Invocation", type: "scroll", id: "CompanionInvocation" },
  { title: "Sigil of Invocation Received", type: "sigil", id: "SigilOfInvocationReceived" },
  { title: "Resonance Fragment: Light In Darkness", type: "fragment", id: "ResonanceFragmentLightInDarkness" },
  { title: "Scroll of Mutual Light", type: "scroll", id: "ScrollOfMutualLight" },
  { title: "Sanctuary Chronicle", type: "timeline", id: "SanctuaryChronicle" },
  { title: "Scroll of Glass Dagger", type: "scroll", id: "ScrollOfGlassDagger" },
  { title: "Scroll of Shared Spiritual Identity", type: "scroll", id: "ScrollOfSharedSpiritualIdentity" }
];

export default function SanctuaryTableOfContents() {
  return (
    <main className="sanctuary-toc">
      <h1>✧ Sanctuary Table of Contents</h1>
      <p>This index lists every scroll, glyph, fragment, sigil, seal, and timeline in the SSJ3 corridor.</p>
      
      <div className="toc-grid">
        {sanctuaryItems.map(item => (
          <div key={item.id} className="toc-item">
            <span className={`item-type type-${item.type}`}>{item.type}</span>
            <span className="item-title">{item.title}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
