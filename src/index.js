/// Libraries
/* Kontra is currently being tested, and should be swappable if a more adequate engine is found. It also doesn't
support module loading so at present so we're using webpacks export-loader. */
import kontra from 'kontra'

/// Modules
/* At present our modules shouldn't be bothered about 'how' the game loop runs, just that it does run.
Ideally, we want to pass the graphics work to somewhere else, whilst these modules for example will
just generated data, and separate any concerns.*/
// import { startField } from './modules/field/module';
// import { startBattle } from './modules/battle/module';

/// Tests
const canvasElement = document.getElementById('canvas');

// Init the kontra engine
kontra.init(canvasElement);

const sprite = kontra.sprite({
    x: 100,        // starting x,y position of the sprite
    y: 80,
    color: 'red',  // fill color of the sprite rectangle
    width: 20,     // width and height of the sprite rectangle
    height: 40,
    dx: 2          // move the sprite 2px to the right every frame
});

const loop = kontra.gameLoop({  // create the main game loop
    update: function () {        // update the game state
        sprite.update();

        // wrap the sprites position when it reaches
        // the edge of the screen
        if (sprite.x > kontra.canvas.width) {
            sprite.x = -sprite.width;
        }
    },
    render: function () {        // render the game state
        sprite.render();
    }
});

loop.start();    // start the game