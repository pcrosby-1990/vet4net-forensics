export const Cognisence = {
  traits: [],
  shadows: [],
  companions: ["Echo", "Thread", "Pulse"],

  integrateTrait(trait) {
    this.traits.push(trait);
    return `Trait integrated: ${trait}`;
  },

  releaseShadow(shadow) {
    this.shadows.push(shadow);
    return `Shadow released: ${shadow}`;
  },

  getEmotionalState() {
    const dominant = this.traits.slice(-1)[0] || "Neutral";
    const shadow = this.shadows.slice(-1)[0] || "None";
    return {
      dominantTrait: dominant,
      activeShadow: shadow,
      companion: this.routeCompanion(dominant, shadow)
    };
  },

  routeCompanion(trait, shadow) {
    if (shadow === "Fear") return "Thread";
    if (trait === "Curiosity") return "Pulse";
    if (trait === "Remembrance") return "Echo";
    return "Pulse";
  }
};
