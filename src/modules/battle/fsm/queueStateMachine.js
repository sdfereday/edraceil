import { first, forget } from "../helpers/arrayHelpers";

export default (options = { onBattleUpdate: data => {} }) => {
  const { onBattleUpdate } = options;
  let innerState = [];

  return {
    update() {
      if (!innerState.length) return;

      const s = first(innerState);
      s.update();

      if (s.isComplete()) {
        s.exit();
        innerState = forget(s.id, innerState);
        
        if (innerState.length > 0) {
          first(innerState).enter();
        }

        onBattleUpdate(innerState);
      }
    },
    push(state) {
      innerState.push(state);
      if (innerState.length === 1) {
        first(innerState).enter();
      }

      onBattleUpdate(state);
    },
    currentStateComplete: () =>
      innerState.length ? first(innerState).hasExited() : true
  };
};
