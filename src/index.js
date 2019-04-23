/// Libraries
/* Kontra doesn't support module loading so at present so we're using webpacks export-loader. */
import kontra from 'kontra'

/// Modules
import World from './modules/world/module'

// Init the kontra engine (MUST happen before you start instancing entities)
const canvasElement = document.getElementById('canvas')
kontra.init(canvasElement)

/// EXPECTED: Kontra should be initialised at this point!
// Load world and pass in game library methods (customise to your needs)
const world = World({
  createSpriteMethod: kontra.sprite,
  keyPressedHandler: kontra.keys.pressed,
  keyBindingMethod: kontra.keys.bind
})

// Main loop (expects kontra)
const loop = kontra.gameLoop({
  update: () => {
    world.update()
  },
  render: () => {
    world.render()
  }
})

loop.start()
