// src/utils/SigilRegistry.js

const SigilRegistry = {
  verified: {
    label: '✅ Verified',
    color: '#28a745',
    glow: 6,
    lore: 'This fragment has been verified by multiple sources and timestamped with integrity.',
    icon: '/assets/icons/verified.png'
  },
  disputed: {
    label: '⚠️ Disputed',
    color: '#ffc107',
    glow: 6,
    lore: 'This fragment is marked as disputed. Attribution is contested or timestamp glyphs are missing.',
    icon: '/assets/icons/disputed.png'
  },
  pending: {
    label: '⏳ Pending',
    color: '#17a2b8',
    glow: 4,
    lore: 'This fragment is awaiting verification or timestamp glyph assignment.',
    icon: '/assets/icons/pending.png'
  }
};

export default SigilRegistry;
