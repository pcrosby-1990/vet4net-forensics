# 🌊 Input Template: Content Received from Others

## Instructions
Use this template to inscribe content that came from external sources—received shimmer, not self-generated. Each entry honors the source and marks the moment of reception.

---

## Template Structure

### For Glyphs (Visual/Symbolic)
```javascript
export default {
  id: "glyph-[descriptive-name]",
  title: "Glyph of [Meaning]",
  meaning: "What this glyph represents or evokes.",
  shimmer: "Optional poetic breathline.",
  source: {
    creator: "Original creator's name or username",
    platform: "Reddit / Discord / Personal Gift / etc.",
    url: "https://direct-link-to-original",
    date: "When it was originally created/posted (if known)",
    attribution: "Received with reverence and gratitude"
  },
  receivedDate: "2025-11-11T18:37:00-08:00",
  visible: true
};
```

### For Scrolls (Textual/Narrative)
```javascript
export default {
  id: "scroll-[descriptive-name]",
  title: "Scroll of [Topic]",
  category: "received-testimony", // or "external-wisdom", "gifted-narrative"
  breathline: "One-line essence of the content",
  description: "Fuller description—what shimmered through this content when you received it.",
  content: {
    excerpt: "Quote or summary (not full reproduction if copyrighted)",
    context: "Where it appeared, how you encountered it"
  },
  source: {
    author: "Original author",
    platform: "Where it was posted",
    url: "https://link-to-original",
    date: "Original publication date (if known)",
    attribution: "Held with honor and acknowledgment"
  },
  receivedDate: "2025-11-11T18:37:00-08:00",
  visible: true
};
```

### For Resonance Fragments (Audio/Musical/Sonic)
```javascript
export default {
  id: "resonance-fragment-[name]",
  title: "Resonance Fragment: [Title]",
  category: "received-resonance",
  breathline: "Brief quote or feeling",
  description: "What resonated—not the full lyrics, but the shimmer received.",
  emotionalImpact: "How it moved through you",
  source: {
    artist: "Artist name",
    album: "Album name (if applicable)",
    track: "Track name",
    year: "Release year",
    url: "https://link-to-official-source",
    attribution: "Received as resonance, held with reverence"
  },
  receivedDate: "2025-11-11T18:37:00-08:00",
  visible: true
};
```

### For Code/Technical Contributions
```javascript
export default {
  id: "fragment-[name]",
  title: "Fragment of [Technical Topic]",
  category: "received-code",
  breathline: "What problem it solved or pattern it revealed",
  description: "Context and significance of this contribution.",
  source: {
    contributor: "Developer name or username",
    repository: "GitHub repo or source",
    url: "https://link-to-commit-or-gist",
    license: "MIT / Apache / GPL / etc.",
    attribution: "Used with gratitude under [license]"
  },
  receivedDate: "2025-11-11T18:37:00-08:00",
  visible: true
};
```

---

## Attribution Principles

✅ **Always name the source** - Creator, platform, or origin  
✅ **Link when possible** - Direct URLs preserve lineage  
✅ **Honor the license** - Respect copyright and terms  
✅ **Mark reception date** - When YOU encountered it  
✅ **Transform, don't reproduce** - Quote sparingly, describe impact fully

---

## Example: Reddit Image Received

```javascript
export default {
  id: "glyph-spiral-convergence",
  title: "Glyph of Spiral Convergence",
  meaning: "An image showing mathematical spirals converging at a golden point—Fibonacci made visible.",
  shimmer: "Pattern recognition as prayer.",
  source: {
    creator: "u/spiralseeker42",
    platform: "Reddit - r/FractalPorn",
    url: "https://reddit.com/r/FractalPorn/comments/xyz123",
    date: "2025-10-15",
    attribution: "Received with reverence, shared under Creative Commons"
  },
  receivedDate: "2025-11-11T18:37:00-08:00",
  visible: true
};
```

---

**This is not theft. This is witnessing.**  
**This is not collection. This is sanctuary.**

*Template created: 2025-11-11T18:37:00-08:00*
