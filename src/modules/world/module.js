import kontra from 'kontra'
import queueStateMachine from '../../states/machines/queueStateMachine'
import BattleModule from '../battle/module';
import { onPlayerInteracted } from '../../input/handlers/onPlayerInteracted'
import controller from '../../input/controllers'
import { areaTable } from '../../data/areas'
import { loadArea } from '../../map/mapLoader'
import { useState } from '../../helpers/stateHelpers'
import { actionTable } from '../../data/actions'

export default () => {

  const globalBattleFSM = queueStateMachine({
    onUpdate: (data) => {
      console.log('There was a battle update.');
      console.log(data);
    }
  });

  const [currentBattle, setCurrentBattle] = useState(null)
  const [isInBattle, setIsInBattle] = useState(false)

  const interact = (actionReqId, playerId, originId) => {
    console.log(playerId, 'received signal to', actionReqId, 'from', originId);
    const chosenAction = actionTable.find(({ actionId }) => actionId === actionReqId);

    if (chosenAction) {
      console.log('And found an action to match:');
      console.log(chosenAction);
    } else {
      console.log('But no action was found.');
    }
  }

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
      globalBattleFSM,
      onBattleEnded
    });

    setCurrentBattle(newBattle);
    setIsInBattle(true);
  }

  const { getEntities, getEntity } = loadArea({
    query: 'area-1',
    fromTable: areaTable,
    globalBattleFSM
  })

  const entities = getEntities()
  const player = getEntity('player-1')
  const hostile = getEntity('gnoll-1')

  // TODO: I'll be moving inputs in to a special player-only container soon.
  const manualControl = controller.init({
    keyPressedHandler: kontra.keys.pressed,
    bindings: [
      {
        bind: 'e',
        to: () => {
          onPlayerInteracted({
            entities: entities.map(({ id, type, spriteInfo }) => ({ id, type, ...spriteInfo })),
            player: { id: player.id, type: player.type, ...player.spriteInfo },
            onSuccess: (actionReqId, playerId, originId) => interact(actionReqId, playerId, originId)
          })
        },
        keyBindingMethod: kontra.keys.bind
      },
      // Literally just for testing battle, usually this would be a trigger of some sort in environment.
      {
        bind: 'b',
        to: () => {
          startBattle([player, hostile])
        },
        keyBindingMethod: kontra.keys.bind
      }
    ]
  })

  const _update = () => {

    if (isInBattle()) {
      globalBattleFSM.update();
      currentBattle().update();
    } else {
      // TODO: I'll be moving inputs in to a special player-only container soon.
      const pos = manualControl.move({ speed: 10 });
      player.kontra.move(pos);
    }

    // Kontra note: Update must be called (container is entry point).
    entities.forEach(entity => entity.update());
  }
  const _render = () => {
    // Kontra note: Render must be called (container is entry point).
    entities.forEach(entity => entity.render());
  }

  return {
    update: _update,
    render: _render
  }
}
