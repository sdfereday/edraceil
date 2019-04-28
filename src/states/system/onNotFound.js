export default ({
    id,
    target,
    exitParams,
    _isComplete = false,
    _exited = false
  }) => ({
    id: "onNotFound",
    isComplete: () => _isComplete,
    hasExited: () => _exited,
    enter() {
      console.error(id + " tried to enter a state that doesn't exist.");
    },
    update() {
      // ...
    },
    exit() {
      // ...
    },
    fail(code) {
      // ...
    }
  });
  