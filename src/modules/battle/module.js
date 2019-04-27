import { createTurnIterator } from "../../utils/turnGenerator";

export default ({ entityContainers, globalActionQueue, onBattleEnded }) => {

  console.log('New battle started!');

  const turnIterator = createTurnIterator(entityContainers);// createTurnIterator(actors);
  const requiredComplete = [globalActionQueue].concat(entityContainers); //.concat(actors);

  // // TODO: This should be done automatically / manually, not here
  // // TODO: This is an id, not a name, fix this in battle module
  // console.log(actors);
  const actorSam = entityContainers.find(({ id }) => id === 'player-1');
  const actorGnoll = entityContainers.find(({ id }) => id === 'gnoll-1');
  actorSam.setTarget(actorGnoll);
  actorGnoll.setTarget(actorSam);

  const _update = () => {
    globalActionQueue.update();

    if (requiredComplete.every(x => x.currentStateComplete())) {
      const { id, decide} = turnIterator.getNextValue();
      console.log(
        "%c" + id + "'s turn.",
        "background: #e2e3e5; color: #383d41"
      );

      entityContainers.map(x => x.onTurnChanged());
      decide();
    }
  }

  return {
    update: _update
  }
}