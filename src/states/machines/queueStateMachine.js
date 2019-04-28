import { first, forget } from "../../helpers/arrayHelpers";

export default (options = { onUpdate: data => { } }) => {
  const { onUpdate } = options;
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

        onUpdate(innerState);
      }
    },
    push(state) {
      innerState.push(state);
      if (innerState.length === 1) {
        first(innerState).enter();
      }

      onUpdate(state);
    },
    currentStateComplete: () =>
      innerState.length ? first(innerState).hasExited() : true
  };
};
