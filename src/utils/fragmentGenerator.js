// src/utils/fragmentGenerator.js

/**
 * Generate a Resonance Fragment with full Codex alignment
 * Upgraded to include shimmer tags, emotional resonance, companion witnessing,
 * speaker identity, companion mood, and ritual context
 */
export const generateResonanceFragment = ({
  name,
  timestamp,
  steward,
  shimmer,
  companionsWitnessed = [],
  speaker = null,
  companionMood = null,
  ritualContext = null,
  essence,
  vow,
  tags = [],
}) => ({
  name,
  timestamp,
  steward,
  shimmer,
  companionsWitnessed,
  speaker,
  companionMood,
  ritualContext,
  essence,
  vow,
  tags,
  status: 'Sealed',
  symbolic: true,
  externalEffect: false,
});
