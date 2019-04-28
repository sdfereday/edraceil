import { createTurnIterator } from "../../utils/turnGenerator";

export default ({ entityContainers, globalBattleFSM, onBattleEnded }) => {

  console.log('New battle started!');
  const turnIterator = createTurnIterator(entityContainers);

  const _update = () => {
    const battleFsmReady = globalBattleFSM.currentStateComplete();
    const actorsReady = entityContainers.every(({ currentStateComplete }) => currentStateComplete());

    if (battleFsmReady && actorsReady) {
      const nextActor = turnIterator.getNextValue();
      const { id, ai, command } = nextActor;
      const { decide } = ai;
      console.log(
        "%c" + id + "'s turn.",
        "background: #e2e3e5; color: #383d41"
      );

      entityContainers.map(({ events }) => events.onBattleTurnChanged());

      const chosenAction = decide(entityContainers.filter(entity => entity.id !== id), nextActor);

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