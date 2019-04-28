export default ({
  id,
  target,
  origin,
  exitParams,
  _isComplete = false,
  _exited = false
}) => ({
  id: "onAttack",
  isComplete: () => _isComplete,
  hasExited: () => _exited,
  enter() {
    console.log("========== 1 ==========");
    console.log(
      "%c -> Entered Attack state " + id,
      "background: #fff3cd; color: #856404"
    );

    setTimeout(() => {
      console.log(
        "%c --> Simulating a fake strike against => " + target.id,
        "background: #fff3cd; color: #856404"
      );
      // Or we use physics hit detection instead (but this way is deterministic).
      target.command({
        action: 'hit',
        meta: {
          damage: 1,
          origin
        }
      });
    }, 500);

    // Waits for user input or a conditional choice, etc.
    setTimeout(() => {
      _isComplete = true;
      console.log(
        "%c <- Attack cycle complete by " + id,
        "background: #fff3cd; color: #856404"
      );
    }, 1000);
  },
  update() {
    // ...
  },
  exit() {
    console.log(
      "%c <- Exited Attack State " + id,
      "background: #fff3cd; color: #856404"
    );
    _exited = true;

    if (exitParams) {
      exitParams.onExit();
    }
  },
  fail(code) {
    // ...
  }
});
