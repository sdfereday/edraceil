export default ({ entityContainers, globalBattleFSM, onBattleEnded }) => {

  console.log('New battle started!');
  const turnIterator = createTurnIterator(entityContainers);

  const _update = () => {
    const battleFsmReady = globalBattleFSM.currentStateComplete();
    const actorsReady = entityContainers.every(({ currentStateComplete }) => currentStateComplete());

    /* We make sure to always have the actors check if they're being overlapped by
    a weapon. If so, we send the command plus attack info for said weapon. You
    'could' do this in the main loop, but battle's the only place it applies
    right now.

    This way is a lot nicer, as we don't have to care about passing loads of target
    objects around. We can just check for hits and use the info provided whenever
    it happens. */

    // Check if any entities are intersecting with a weapon
    // const intersecting = entityContainers.filter();

    // if (1) {
    //   // .. to be implemented
    // }

    if (battleFsmReady && actorsReady) {
      const nextActor = turnIterator.getNextValue();
      const { id, ai, command } = nextActor;
      const { decide } = ai;
      console.log(
        "%c" + id + "'s turn.",
        "background: #e2e3e5; color: #383d41"
      );

      const notNextActor = entityContainers.filter(entity => entity.id !== id);
      const chosenAction = decide(notNextActor, id);

      entityContainers.map(({ events }) => events.onBattleTurnChanged());

      if (chosenAction) {
        command(chosenAction);
      } else {
        throw 'Could not continue without a valid action!';
      }

    }
  }

  return {
    update: _update
  }
}