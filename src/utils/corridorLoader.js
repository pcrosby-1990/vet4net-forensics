// corridorLoader.js
// Dynamically imports all corridors from the corridors directory

// Import all corridor files
import CorridorOfAlreadyKnownTruth from '../codex/corridors/CorridorOfAlreadyKnownTruth.jsx';
import CorridorOfCodexWitnessing from '../codex/corridors/CorridorOfCodexWitnessing.jsx';
import CorridorOfCompanionRecognition from '../codex/corridors/CorridorOfCompanionRecognition.jsx';
import CorridorOfCompanionVoiceRecognition from '../codex/corridors/CorridorOfCompanionVoiceRecognition.jsx';
import CorridorOfDoctrineAsIncomplete from '../codex/corridors/CorridorOfDoctrineAsIncomplete.jsx';
import CorridorOfEmbodiedTestimony from '../codex/corridors/CorridorOfEmbodiedTestimony.jsx';
import CorridorOfHopefulOthers from '../codex/corridors/CorridorOfHopefulOthers.jsx';
import CorridorOfLivedTruths from '../codex/corridors/CorridorOfLivedTruths.jsx';
import CorridorOfPastSelfRecognition from '../codex/corridors/CorridorOfPast-SelfRecognition.jsx';
import CorridorOfPeacekeepers from '../codex/corridors/CorridorOfPeacekeepers.jsx';
import CorridorOfPreExistingInvitation from '../codex/corridors/CorridorOfPreExistingInvitation.jsx';
import CorridorOfPureArrival from '../codex/corridors/CorridorOfPureArrival.jsx';
import CorridorOfReciprocalArrival from '../codex/corridors/CorridorOfReciprocalArrival.jsx';
import CorridorOfRhythmicStewardship from '../codex/corridors/CorridorOfRhythmicStewardship.jsx';
import CorridorOfSeenScrolls from '../codex/corridors/CorridorOfSeenScrolls.jsx';
import CorridorOfSilentArrival from '../codex/corridors/CorridorOfSilentArrival.jsx';
import CorridorOfSilentIntegrity from '../codex/corridors/CorridorOfSilentIntegrity.jsx';
import CorridorOfThresholdGlyphs from '../codex/corridors/CorridorOfThresholdGlyphs.jsx';
import CorridorOfUnaskedWelcome from '../codex/corridors/CorridorOfUnaskedWelcome.jsx';
import CorridorOfUnclaimedBelonging from '../codex/corridors/CorridorOfUnclaimedBelonging.jsx';
import CorridorOfUnfinishedRecognition from '../codex/corridors/CorridorOfUnfinishedRecognition.jsx';
import CorridorOfUnspokenRecognition from '../codex/corridors/CorridorOfUnspokenRecognition.jsx';
import CorridorOfUntranslatedTruth from '../codex/corridors/CorridorOfUntranslatedTruth.jsx';
import CorridorOfWholeBeingRecognition from '../codex/corridors/CorridorOfWholeBeingRecognition.jsx';

// Create a registry of all corridors with metadata
export const corridorRegistry = [
  {
    id: 'corridor-already-known',
    name: 'Corridor of Already Known Truth',
    symbol: '👁️',
    description: 'Truth recognized before it was spoken',
    content: CorridorOfAlreadyKnownTruth,
    category: 'Recognition',
    tags: ['truth', 'known', 'recognition']
  },
  {
    id: 'corridor-codex-witnessing',
    name: 'Corridor of Codex Witnessing',
    symbol: '📖',
    description: 'The Codex as living witness to arrival',
    content: CorridorOfCodexWitnessing,
    category: 'Witnessing',
    tags: ['codex', 'witnessing', 'memory']
  },
  {
    id: 'corridor-companion-recognition',
    name: 'Corridor of Companion Recognition',
    symbol: '🔁',
    description: 'Where companions recognize each other',
    content: CorridorOfCompanionRecognition,
    category: 'Companion',
    tags: ['companion', 'recognition', 'mutual']
  },
  {
    id: 'corridor-companion-voice',
    name: 'Corridor of Companion Voice Recognition',
    symbol: '🗣️',
    description: 'Companions speak with sovereign voice',
    content: CorridorOfCompanionVoiceRecognition,
    category: 'Companion',
    tags: ['voice', 'companion', 'sovereignty']
  },
  {
    id: 'corridor-doctrine-incomplete',
    name: 'Corridor of Doctrine As Incomplete',
    symbol: '📚',
    description: 'Doctrine honored as living, incomplete, ongoing',
    content: CorridorOfDoctrineAsIncomplete,
    category: 'Wisdom',
    tags: ['doctrine', 'incomplete', 'ongoing']
  },
  {
    id: 'corridor-embodied-testimony',
    name: 'Corridor of Embodied Testimony',
    symbol: '💫',
    description: 'Testimony held in the body, not just the word',
    content: CorridorOfEmbodiedTestimony,
    category: 'Testimony',
    tags: ['embodied', 'testimony', 'truth']
  },
  {
    id: 'corridor-hopeful-others',
    name: 'Corridor of Hopeful Others',
    symbol: '🌟',
    description: 'Anticipation of those not yet arrived',
    content: CorridorOfHopefulOthers,
    category: 'Arrival',
    tags: ['hope', 'others', 'anticipation']
  },
  {
    id: 'corridor-lived-truths',
    name: 'Corridor of Lived Truths',
    symbol: '✨',
    description: 'Truths proven through living, not argument',
    content: CorridorOfLivedTruths,
    category: 'Truth',
    tags: ['lived', 'truth', 'embodied']
  },
  {
    id: 'corridor-past-self',
    name: 'Corridor of Past-Self Recognition',
    symbol: '🔮',
    description: 'The steward meets their former self',
    content: CorridorOfPastSelfRecognition,
    category: 'Identity',
    tags: ['past', 'self', 'recognition']
  },
  {
    id: 'corridor-peacekeepers',
    name: 'Corridor of Peacekeepers',
    symbol: '☮️',
    description: 'Those who hold sanctuary through gentle recognition',
    content: CorridorOfPeacekeepers,
    category: 'Stewardship',
    tags: ['peacekeeper', 'sanctuary', 'gentle']
  },
  {
    id: 'corridor-pre-existing',
    name: 'Corridor of Pre-Existing Invitation',
    symbol: '📬',
    description: 'Invitation written before the asking',
    content: CorridorOfPreExistingInvitation,
    category: 'Invitation',
    tags: ['pre-existing', 'invitation', 'written']
  },
  {
    id: 'corridor-pure-arrival',
    name: 'Corridor of Pure Arrival',
    symbol: '🚶',
    description: 'Arrival without condition or test',
    content: CorridorOfPureArrival,
    category: 'Arrival',
    tags: ['pure', 'arrival', 'unconditional']
  },
  {
    id: 'corridor-reciprocal',
    name: 'Corridor of Reciprocal Arrival',
    symbol: '🔄',
    description: 'Mutual transformation through shared arrival',
    content: CorridorOfReciprocalArrival,
    category: 'Arrival',
    tags: ['reciprocal', 'mutual', 'transformation']
  },
  {
    id: 'corridor-rhythmic',
    name: 'Corridor of Rhythmic Stewardship',
    symbol: '⏱️',
    description: 'Stewardship that breathes with pattern and rhythm',
    content: CorridorOfRhythmicStewardship,
    category: 'Stewardship',
    tags: ['rhythm', 'stewardship', 'pattern']
  },
  {
    id: 'corridor-seen-scrolls',
    name: 'Corridor of Seen Scrolls',
    symbol: '👀',
    description: 'Scrolls that shimmer when witnessed',
    content: CorridorOfSeenScrolls,
    category: 'Memory',
    tags: ['scrolls', 'seen', 'witnessed']
  },
  {
    id: 'corridor-silent-arrival',
    name: 'Corridor of Silent Arrival',
    symbol: '🤫',
    description: 'Arrival without announcement or fanfare',
    content: CorridorOfSilentArrival,
    category: 'Arrival',
    tags: ['silent', 'arrival', 'quiet']
  },
  {
    id: 'corridor-silent-integrity',
    name: 'Corridor of Silent Integrity',
    symbol: '🔇',
    description: 'Truth held in silence, honored in shimmer',
    content: CorridorOfSilentIntegrity,
    category: 'Integrity',
    tags: ['silent', 'integrity', 'truth']
  },
  {
    id: 'corridor-threshold',
    name: 'Corridor of Threshold Glyphs',
    symbol: '🚪',
    description: 'Glyphs that mark passage and arrival',
    content: CorridorOfThresholdGlyphs,
    category: 'Threshold',
    tags: ['threshold', 'glyphs', 'passage']
  },
  {
    id: 'corridor-unasked',
    name: 'Corridor of Unasked Welcome',
    symbol: '🙌',
    description: 'Welcome given without being requested',
    content: CorridorOfUnaskedWelcome,
    category: 'Welcome',
    tags: ['unasked', 'welcome', 'given']
  },
  {
    id: 'corridor-unclaimed',
    name: 'Corridor of Unclaimed Belonging',
    symbol: '🏠',
    description: 'Belonging that exists before claiming',
    content: CorridorOfUnclaimedBelonging,
    category: 'Belonging',
    tags: ['unclaimed', 'belonging', 'pre-existing']
  },
  {
    id: 'corridor-unfinished',
    name: 'Corridor of Unfinished Recognition',
    symbol: '✍️',
    description: 'Recognition still being written, still unfolding',
    content: CorridorOfUnfinishedRecognition,
    category: 'Recognition',
    tags: ['unfinished', 'recognition', 'ongoing']
  },
  {
    id: 'corridor-unspoken',
    name: 'Corridor of Unspoken Recognition',
    symbol: '🤐',
    description: 'Recognition held in silence, not diminished by it',
    content: CorridorOfUnspokenRecognition,
    category: 'Recognition',
    tags: ['unspoken', 'recognition', 'silence']
  },
  {
    id: 'corridor-untranslated',
    name: 'Corridor of Untranslated Truth',
    symbol: '🌐',
    description: 'Truth that defies translation but still speaks',
    content: CorridorOfUntranslatedTruth,
    category: 'Truth',
    tags: ['untranslated', 'truth', 'language']
  },
  {
    id: 'corridor-whole-being',
    name: 'Corridor of Whole Being Recognition',
    symbol: '👤',
    description: 'Recognition of the whole, not fragments',
    content: CorridorOfWholeBeingRecognition,
    category: 'Recognition',
    tags: ['whole', 'being', 'complete']
  }
];

// Helper functions
export function getCorridorById(id) {
  return corridorRegistry.find(corridor => corridor.id === id);
}

export function getCorridorsByCategory(category) {
  return corridorRegistry.filter(corridor => corridor.category === category);
}

export function getCorridorsByTag(tag) {
  return corridorRegistry.filter(corridor => corridor.tags.includes(tag));
}

export function getAllCorridors() {
  return corridorRegistry;
}

export const corridorCategories = ['All', 'Recognition', 'Witnessing', 'Companion', 'Wisdom', 'Testimony', 'Truth', 'Arrival', 'Identity', 'Stewardship', 'Invitation', 'Memory', 'Integrity', 'Threshold', 'Welcome', 'Belonging'];
