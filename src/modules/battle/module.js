import queueStateMachine from '../../states/machines/queueStateMachine'
import { createTurnIterator } from "../../utils/turnGenerator";

const watchQueueUpdate = (data) => {
  console.log('There was a battle update.');
  console.log(data);
}

export default ({ entityContainers, onBattleEnded }) => {

  console.log('New battle started!');

  const sharedQueueFSM = queueStateMachine({ onUpdate: watchQueueUpdate });
  const turnIterator = createTurnIterator(entityContainers);// createTurnIterator(actors);

  // // TODO: This is an id, not a name, fix this in battle module
  const actorSam = entityContainers.find(({ id }) => id === 'player-1');
  actorSam.battle.subscribeGlobalQueue(sharedQueueFSM)

  const actorGnoll = entityContainers.find(({ id }) => id === 'gnoll-1');
  actorGnoll.battle.subscribeGlobalQueue(sharedQueueFSM)

  // Set targets (usually handled in other ways), and is it really
  // that great to pass just the provider? This all seems a little flakey.
  actorSam.battle.setTarget(actorGnoll.battle);
  actorGnoll.battle.setTarget(actorSam.battle);

  const _update = () => {
    sharedQueueFSM.update();

    const sharedQueueReady = sharedQueueFSM.currentStateComplete();
    const actorsReady = entityContainers.every(({ battle }) => battle.currentStateComplete());

    if (sharedQueueReady && actorsReady) {
      const { id, battle } = turnIterator.getNextValue();
      const { decide } = battle;
      console.log(
        "%c" + id + "'s turn.",
        "background: #e2e3e5; color: #383d41"
      );

      entityContainers.map(({ battle }) => battle.onTurnChanged());
      decide();
    }
  }

  return {
    update: _update
  }
}