import { createTurnIterator } from "./utils/turnGenerator";
import queueStateMachine from "./fsm/queueStateMachine";
// import actor from "./entities/actor";
// import aiActor from "./entities/aiActor";

/*
1) battle entered
2) entity containers passed in
3) since actors are already updating, run their fsms
as below.
4) enemy for instance is told to decide by the battle manager,
decision release an action or rather a state name to perform
5) using the interaction command, the entity knows what to do
with it in its list of actions
6) since the battler needs to know when said command is complete,
the entity container once again has a method on it we can check
without worrying about implementation. This will be useful when
giving other commands that aren't to do with battle
/*
- Should an entity fall during battle, it will happen after theis damage state
has completed. Therefore we can check the battle conditions to determine if we have a winner.
*/
const watchBattleUpdate = (data) => {
  console.log('There was a battle update.');
  console.log(data);
}

/*
Example flow:
a pushes attack [main queue]
a hits b [trigger]
b hit animation pushed [internal state]
a returns to position [internal state]
b waits for hit animation to finish [internal state]
b then pushes a counter [onExit main queue]
b hits a
a animation hit starts
b returns
a animation finishes
next turn
*/

export default ({ entityContainers, onBattleEnded }) => {

  console.log('New battle started!');
  
  const actorQueueState = queueStateMachine({ // Not 100% certain if this is still needed...
    onBattleUpdate: watchBattleUpdate
  });

  const turnIterator = createTurnIterator(entityContainers);// createTurnIterator(actors);
  const requiredComplete = [actorQueueState].concat(entityContainers); //.concat(actors);

  // // TODO: This should be done automatically / manually, not here
  // // TODO: This is an id, not a name, fix this in battle module
  // console.log(actors);
  const actorSam = entityContainers.find(({ id }) => id === 'player-1');
  const actorGnoll = entityContainers.find(({ id }) => id === 'gnoll-1');
  actorSam.setTarget(actorGnoll);
  actorGnoll.setTarget(actorSam);

  const _update = () => {
    actorQueueState.update();

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