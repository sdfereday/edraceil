import { isOverlapping } from '../../helpers/collisionHelpers'
import { distance } from '../../helpers/physicsHelpers'
import { getAction } from '../../helpers/actionHelpers'
import { actionTable } from '../../data/actions'

export const onPlayerInteracted = ({ entities, player }) => {
  // player.interact((interestingData) => {
  //     console.log(interestingData);
  // });

  const overlappingWithPlayer = entities
    .filter(entity => {
      if (entity.type !== 'player') {
        // Circle vs circle detection (still being tested, needs to use hitboxes really),
        // at present props are a little confused with each other (x and y specifically).
        // So that part needs a little re-working.
        const a = {
          x: entity.x(),
          y: entity.y(),
          width: entity.width(),
          radius: entity.hitbox().radius
        }

        const b = {
          x: player.x(),
          y: player.y(),
          width: player.width(),
          radius: player.hitbox().radius
        }

        return isOverlapping(a, b)
      }

      return false
    })
    .sort(
      (a, b) =>
        distance({ x: a.x(), y: a.y() }, { x: player.x(), y: player.y() }) <
        distance({ x: b.x(), y: b.y() }, { x: player.x(), y: player.y() })
    )

  // With distance check applied also
  if (overlappingWithPlayer.length) {
    const entity = overlappingWithPlayer[0]
    const actionReq = getAction({
      id: entity.id,
      type: entity.type,
      actionTable
    })

    entity.interact(actionReq)
  }

  // Useful for enemies
  // sprites = sprites.filter(sprite => sprite.isAlive());
}
