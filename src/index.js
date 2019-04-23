/// Libraries
/* Kontra is currently being tested, and should be swappable if a more adequate engine is found. It also doesn't
support module loading so at present so we're using webpacks export-loader. */
import kontra from 'kontra'

/// Modules
/* At present our modules shouldn't be bothered about 'how' the game loop runs, just that it does run.
Ideally, we want to pass the graphics work to somewhere else, whilst these modules for example will
just generated data, and separate any concerns. */
import Field from './modules/field/module'
// import { startBattle } from './modules/battle/module';

/// Kontra setup (MUST happen first)
const canvasElement = document.getElementById('canvas')
// Init the kontra engine (MUST happen before you start instancing entities)
kontra.init(canvasElement)

/// EXPECTED: Kontra should be initialised at this point!
// Load area and expose util methods
const initialisedField = Field({
  createSpriteMethod: kontra.sprite,
  keyPressedHandler: kontra.keys.pressed,
  keyBindingMethod: kontra.keys.bind
})

// Main loop
const loop = kontra.gameLoop({
  update: () => {
    initialisedField.update()
  },
  render: () => {
    initialisedField.render()
  }
})

loop.start()
