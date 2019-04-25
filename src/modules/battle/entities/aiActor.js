import normalStateMachine from '../fsm/normalStateMachine'
import { onHit, onCounter } from '../states/stateRegistry'
import { genericGambit } from '../ai/gambits'
import { doStatLogic } from '../ai/functions'
import { poison, petrify } from '../../../data/statuses'

export default ({
  id,
  name = 'ai',
  onActorUpdate = data => {},
  getStat = query => {},
  setStat = (k, v) => {},
  command = command => {},
  _target = null
}, globalFSM) => {
  // TODO: Ensure you're getting individual instances of stats, it may not
  // Internal fsm handles all personal actions (animations, etc)
  const internalFSM = normalStateMachine()

  // be the case if 'stats' is just being exported as an object.
  const hp = getStat('health');

  // Statuses that this entity are susceptible to a pushed here.
  const susceptibleTo = getStat('susceptibleTo');

  // TODO: Make sure to check susceptible trait when setting statuses (not done here). This
  // also needs wiring up, including tickers. This will be part of damage and hp output work.
  setStat('status', poison);
  setStat('status', petrify);
  console.log(getStat('status'));

  return {
    id,
    name,
    setTarget: target => {
      console.log(name + "'s target was set to " + target.name + '.')
      _target = target
    },
    update: () => internalFSM.update(),
    decide: () => {
      // So you can actually swap out different gambits depending on the mode
      // the entity is in. You could potentially have a gambit that specifies
      // gambits to use.
      console.log(name + ' is deciding what to do...')
      const stateResult = doStatLogic([hp, susceptibleTo], genericGambit)
      const chosenState = stateRegistry.get(stateResult)
      console.log('Chose state:', stateResult)

      // Using this methods 'assumes' that all states take the same sort of data.
      globalFSM.push(
        chosenState({
          ownerId: id,
          target: _target,
          name
        })
      )
    },
    hit: ({ damage, originData }) => {
      console.log(name + ' got a hit from ' + originData.name + '.')
      const hitState = onHit({
        name,
        ownerId: id,
        exitParams: {
          onExit: () => {
            // You'd check stats here also.
            onActorUpdate({
              hp
            })

            console.log(name + ' decided to counter ' + originData.name + '.')
            const counterState = onCounter({
              ownerId: id,
              target: _target,
              name
            })

            globalFSM.push(counterState)
          }
        }
      })

      internalFSM.push(hitState)
    },
    counterHit: ({ damage, originData }) => {
      console.log(name + ' got a counter attack hit from ' + originData.name + '.');
      const hitState = onHit({
        ownerId: id,
        name,
        onExit: () => {
          // You'd check stats here also.
          onActorUpdate({
            hp
          })
        }
      })

      internalFSM.push(hitState)
    },
    currentStateComplete: () => internalFSM.currentStateComplete(),
    onTurnChanged: () => {}
  }
}
