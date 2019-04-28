export default ({
  id,
  target,
  origin,
  exitParams,
  _isComplete = false,
  _exited = false
}) => ({
  id: "onCounter",
  isComplete: () => _isComplete,
  hasExited: () => _exited,
  enter() {
    console.log("========== 3 ==========");
    // TODO: Get actor data by ID here perhaps instead of passing it all?
    console.log(
      "%c----> Execute Counter State For " + id,
      "background: #cce5ff; color: #004085"
    );

    console.log(
      "%c----> Attacking " + "???", //target.getName(),
      "background: #cce5ff; color: #004085"
    );

    target.command({
      action: 'counterHit',
      meta: {
        damage: 1,
        originId: id
      }
    });

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
