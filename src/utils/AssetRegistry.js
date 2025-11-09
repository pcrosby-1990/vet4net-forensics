// src/utils/AssetRegistry.js

const AssetRegistry = {
  sigils: {
    verified: {
      label: '✅ Verified',
      icon: '/assets/icons/verified.png',
      glow: 6,
      color: '#28a745',
      lore: 'This fragment has been verified by multiple sources and timestamped with integrity.'
    },
    disputed: {
      label: '⚠️ Disputed',
      icon: '/assets/icons/disputed.png',
      glow: 6,
      color: '#ffc107',
      lore: 'This fragment is marked as disputed. Attribution is contested or timestamp glyphs are missing.'
    }
  },
  glyphs: {
    spiral: '/assets/glyphs/spiral.svg',
    threshold: '/assets/glyphs/threshold.svg',
    echo: '/assets/glyphs/echo.svg'
  },
  backgrounds: {
    parchment: '/assets/backgrounds/parchment.jpg',
    codex: '/assets/backgrounds/codex.png'
  },
  fonts: {
    sigil: "'Courier New', monospace",
    scroll: "'Georgia', serif"
  }
};

export default AssetRegistry;
