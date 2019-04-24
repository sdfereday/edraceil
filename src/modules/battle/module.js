import { createTurnIterator } from "./utils/turnGenerator";
import queueStateMachine from "./fsm/queueStateMachine";
import actor from "./entities/actor";
import aiActor from "./entities/aiActor";

/*
- Should an entity fall during battle, it will happen after theis damage state
has completed. Therefore we can check the battle conditions to determine if we have a winner.
*/
const watchBattleUpdate = (data) => {
  console.log('There was a battle update.');
  console.log(data);
}

const watchActorUpdate = (data) => {
  console.log('There was an actor update.');
  console.log(data);
}

export default ({ participantData, onBattleEnded }) => {

  console.log('New battle started!');
  
  const actorQueueState = queueStateMachine({
    onBattleUpdate: watchBattleUpdate
  });

  const actors = participantData.map(actorContainer => {
    const { id, type, getStats, setStats, command } = actorContainer;
    
    // TODO: Use consts please.
    return type === 'player' ?
      actor(id, actorQueueState, watchActorUpdate, { getStats, setStats, command }) :
      aiActor(id, actorQueueState, watchActorUpdate, { getStats, setStats, command });
  })

  const turnIterator = createTurnIterator(actors);
  const requiredComplete = [actorQueueState].concat(actors);

  // TODO: This should be done automatically / manually, not here
  // TODO: This is an id, not a name, fix this in battle module
  const actorSam = actors.find(({ name }) => name === 'player-1');
  const actorGnoll = actors.find(({ name }) => name === 'gnoll-1');
  actorSam.setTarget(actorGnoll);
  actorGnoll.setTarget(actorSam);

  const _update = () => {
    actorQueueState.update();
    actors.forEach(x => x.update());

    if (requiredComplete.every(x => x.currentStateComplete())) {
      const nextTurnTaker = turnIterator.getNextValue();
      console.log(
        "%c" + nextTurnTaker.name + "'s turn.",
        "background: #e2e3e5; color: #383d41"
      );

      actors.map(x => x.onTurnChanged());
      nextTurnTaker.decide();
    }
  }

  return {
    update: _update
  }
}