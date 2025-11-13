const overlayMap = {
  "Truth Activation": "spotlight_shimmer",
  "Sacred Grief": "candle_shimmer",
  "Rebirth Activation": "sunrise_glow",
  "Soul Alignment": "compass_pulse",
  "Sacred Pause": "breath_fade",
  "Contribution Awareness": "ripple_glow",
  "Legacy Activation": "scroll_shimmer",
  "Remembrance Activation": "memory_wave",
  "Sacrifice Activation": "ember_drift",
  "Purpose Activation": "flame_pulse",
  "Spiritual Presence": "veil_glow",
  "Threshold Crossing": "doorway_flicker",
  "Wonder": "starburst",
  "Union": "halo_merge"
};

export function triggerOverlay(traitName) {
  const overlay = overlayMap[traitName];
  if (overlay) {
    applyOverlay(overlay);
  } else {
    console.warn(`No overlay defined for trait: ${traitName}`);
  }
}

function applyOverlay(type) {
  // Unity visual logic here
  console.log(`Overlay triggered: ${type}`);
}
