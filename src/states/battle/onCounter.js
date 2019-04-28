export default ({
  id,
  target,
  exitParams,
  _isComplete = false,
  _exited = false
}) => ({
  id: "onCounter",
  isComplete: () => _isComplete,
  hasExited: () => _exited,
  enter() {
    // Counter push may happen on a hit, can be found at the commands
    // area. Overlapping physics means we need only go to the location.
    // Any stat math can be done in the onHit, or just before it. You can
    // also get the weapon data origin to read what you're up against.
    console.log("========== 3 ==========");
    console.log(
      "%c----> Execute Counter State For " + id,
      "background: #cce5ff; color: #004085"
    );

    // Or we use physics hit detection instead (but this way is deterministic).
    // const targetObj = battleStore.get(target);
    // targetObj.command({
    //   action: 'counterHit',
    //   meta: {
    //     damage: 1,
    //     origin: id
    //   }
    // });

    console.log(
      "%c----> Attacking " + target, //target.getName(),
      "background: #cce5ff; color: #004085"
    );

    setTimeout(() => {
      _isComplete = true;
    }, 5000);
  },
  update() {
    // ...
  },
  exit() {
    console.log(
      "%cExited Counter State " + id,
      "background: #cce5ff; color: #004085"
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
