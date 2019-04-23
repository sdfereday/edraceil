/// Input
import { onPlayerInteracted } from '../../input/handlers/onPlayerInteracted'
import controller from '../../input/controllers'

/// Map Data
import { areaTable } from '../../data/areas'
import { loadArea } from '../../map/mapLoader'

export default ({
  createSpriteMethod,
  keyPressedHandler,
  keyBindingMethod
}) => {
  const { getEntities, getEntity } = loadArea({
    query: 'area-1',
    fromTable: areaTable,
    createSpriteMethod
  })

  const entities = getEntities()
  const player = getEntity('player-1')

  const manualControl = controller.init({
    keyPressedHandler,
    bindings: [
      {
        bind: 'e',
        to: () => {
          onPlayerInteracted({ entities, player })
        },
        keyBindingMethod
      }
    ]
  })

  const _update = () => {
    // Could just as easily be automatically controlled so we handle from outside.
    const pos = manualControl.move({ speed: 10 })
    player.move(pos)

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
