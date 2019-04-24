import { top, forget } from "../helpers/arrayHelpers";

export default (options = { onBattleUpdate: data => {} }) => {
  const { onBattleUpdate } = options;
  let innerState = [];

  return {
    update() {
      if (!innerState.length) return;

      const s = top(innerState);
      s.update();

      if (s.isComplete()) {
        s.exit();
        innerState = forget(s.id, innerState);

        onBattleUpdate(innerState);
      }
    },
    push(state) {
      innerState.push(state);
      top(innerState).enter();

      onBattleUpdate(state);
    },
    currentStateComplete: () =>
      innerState.length ? top(innerState).hasExited() : true
  };
};
