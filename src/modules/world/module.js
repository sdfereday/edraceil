/// Sub Modules
import BattleModule from '../battle/module';

/// Input
import { onPlayerInteracted } from '../../input/handlers/onPlayerInteracted'
import controller from '../../input/controllers'

/// Map Data
import { areaTable } from '../../data/areas'
import { loadArea } from '../../map/mapLoader'

/// State
import queueStateMachine from '../../states/machines/queueStateMachine'
import { useState } from '../../helpers/stateHelpers'

// ...
const watchQueueUpdate = (data) => {
  console.log('There was a battle update.');
  console.log(data);
}

export default ({
  createSpriteMethod,
  keyPressedHandler,
  keyBindingMethod
}) => {
  // Used for any blocking-events that are needed to be created (field or battle)
  const globalActionQueue = queueStateMachine({
    onUpdate: watchQueueUpdate
  });

  const [currentBattle, setCurrentBattle] = useState(null)
  const [isInBattle, setIsInBattle] = useState(false)

  const onBattleEnded = () => {
    /*
    When battle results tallied, etc
    - Re-enable the movement inputs for player
    */
   setCurrentBattle(null);
   setIsInBattle(false);
  }

  const startBattle = entityContainers => {

    // Never start a second battle if one is in progress!
    if (isInBattle()) {
      return;
    }

    /*
    Upon triggering with enemy / scene
    - Show graphical ui for battle
    - Set positions of entities to nearest available battle coords
    */
   // ... find positions in battle radius (should be able to get these from the area data
   // and current zone everything's in). Each battle needs a zone, regardless wether it's
   // programatically done.
   const newBattle = BattleModule({
      entityContainers,
      globalActionQueue,
      onBattleEnded
   });

   setCurrentBattle(newBattle);
   setIsInBattle(true);
  }

  const { getEntities, getEntity } = loadArea({
    query: 'area-1',
    fromTable: areaTable,
    globalActionQueue,
    createSpriteMethod
  })

  const entities = getEntities()
  const player = getEntity('player-1')
  const hostile = getEntity('gnoll-1')

  const manualControl = controller.init({
    keyPressedHandler,
    bindings: [
      {
        bind: 'e',
        to: () => {
          onPlayerInteracted({ entities, player })
        },
        keyBindingMethod
      },
      // Literally just for testing battle, usually this would be a trigger of some sort in environment.
      {
        bind: 'b',
        to: () => {
          startBattle([player, hostile])
        },
        keyBindingMethod
      }
    ]
  })

  const _update = () => {

    if (isInBattle()) {
      const battle = currentBattle();
      battle.update()
    } else {
      const pos = manualControl.move({ speed: 10 })
      player.move(pos)
    }

    // Kontra note: Update must be called (container is entry point).
    entities.forEach(entity => entity.update())
  }
  const _render = () => {
    // Kontra note: Render must be called (container is entry point).
    entities.forEach(entity => entity.render())
  }

  return {
    update: _update,
    render: _render
  }
}
