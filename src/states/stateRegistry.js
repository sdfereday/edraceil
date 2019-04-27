import onAttack from "./battle/onAttack";
import onCounter from "./battle/onCounter";
import onHit from "./response/onHit";
import onNotFound from "./system/onNotFound";
import onBreak from "./system/onBreak";

export {
  onAttack,
  onHit,
  onCounter,
  onBreak
};

// State registry doesn't have to be used, it's just easier when the required
// state is not determined. But I'm choosing to use it regardless.
export default {
  get: stateKey =>
    Object.keys(registry).some(k => k === stateKey)
      ? registry[stateKey]
      : onNotFound
};
