import { top, forget } from "../../helpers/arrayHelpers";

export const fsm = (options = { onUpdate: data => { } }) => {
  const { onUpdate } = options;
  let innerState = [];

  return {
    update() {
      if (!innerState.length) return;

      const s = top(innerState);
      s.update();

      if (s.isComplete()) {
        s.exit();
        innerState = forget(s.id, innerState);

        onUpdate(innerState);
      }
    },
    push(state) {
      innerState.push(state);
      top(innerState).enter();

      onUpdate(state);
    },
    currentStateComplete: () =>
      innerState.length ? innerState.every(x => x.hasExited()) : true
  };
};

export default fsm;