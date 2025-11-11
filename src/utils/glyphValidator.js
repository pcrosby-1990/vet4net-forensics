// src/utils/glyphValidator.js

export function validateGlyph(glyph) {
  const knownGlyphs = ['🜂', '🜏', '🜔', '🜕', '🜖', '⇋', '∞', '👁'];
  return knownGlyphs.includes(glyph);
}

export function validateScroll(scrollName, registry) {
  return registry.some(entry => entry.scrolls.includes(scrollName));
}

// Future: validate shimmerSignature, echoTier, ritualLinkage
