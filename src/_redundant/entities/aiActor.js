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
  /* TODO: So far states are quite removed from the entity container due to different
  modes in the game. I'm guessing just throwing in the entire object is a bit much, but
  the 'command' method could be potentially passed in to each state presumably?
  Animators on the actual entity will be running at this point, then command will return
  when it's done.
  An alternative is to have all the different states in one place, and when a command
  is sent to the entity, it'll pick what it needs to from the bunch. Even things like
  getting hit by another entity could technically be registered. Only problem is, if we're
  waiting in here for things to finish we'll need some form of callback / wait mechanism.
  It gets messy now, I mean even animations need to finish as part of a state too. Perhaps
  the command method is just a better idea, because that way you can just call it in here
  without worrying about how it's been implemented on the other side.
  See further down for an example of 'command / callback' */
  command = (command, callback) => {},
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
        // Passes in a method that the state can pass commands to the owner.
        commandEntity: command,
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
