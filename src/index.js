/// Notes
/*
- Sprites don't really do much and just move when / where told to. They also have interact
triggers so we know where they are in the world.
- Behind the scenes services will run and produce results based on what they're given. This could
be anything from 'turn this on because this happened' to, 'get me this as a sprite just
collided' etc.
- Controls will be attached to sprites but not inside the sprites as we might need to take over
them automatically for whatever reason.
- I would advise making a sort of animation state machine system that, depending on the state
of a service, will trigger something off?
- Don't make it complex for goodness sake, if the idea doesn't work, try another.
*/

/// Libraries
/* Kontra is currently being tested, and should be swappable if a more adequate engine is found. It also doesn't
support module loading so at present so we're using webpacks export-loader. */
import kontra from 'kontra'

/// Helpers
import { normalize } from './helpers/vectorHelpers';

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

// An entity.
/* Entities will have a few properties:
- An ID to link to other data resources (what it is, etc)
- A corresponding sprite object
- Using the id we attach stats also
- Basically the ID connects all the pieces together here

Example:
In the field you'll have a sprite with an ID (say it's player-controller),
if sprite interacts with a thing, we respond to said event in a decoupled way,
passing the ID of the thing and the player.
From there we can determine:
- That we're in the field
- That the player sprite interacted
- And the thing it interacted with
- We can then decide what to do with this interaction

For instance we could:
- Start a battle passing in the ID of both (using said ID we can monitor / modify stats)
- Start a conversation (using ID we can start a simple convo)
- Start a cutscene (using the ID's we can start a cutscene state (for later versions))

The idea here is to decouple concerns as much as possible, but respond to the given ID, and with
such an ID we can modify or listen to what we want and react in any way we see fit.

Anything that requires visual feedback can be passed to whatever module cares about it. If an event
goes off for a door opening, we might:
- Update the door graphic on the sprite its self
- Update the data for the door so that in future it stays open (since we've opened it)

Things like this would be stored in level data anyway using a hashing system for example.

Okay so now that's out of the way, the first test is to:
- Produce a player character that can move around using user input
- Interact with something and send the event back up so we know about it
- Deal with the event and effect anything that cares
*/
// This is our player sprite. You can basically move this / attach it to anything
// that needs to make a visual feedback (could be a cutscene, could be the field, etc)
const sprite = kontra.sprite({
    x: 100,        // starting x,y position of the sprite
    y: 80,
    color: 'red',  // fill color of the sprite rectangle
    width: 20,     // width and height of the sprite rectangle
    height: 40,
    //dx: 2          // move the sprite 2px to the right every frame
});

// Control managers
const manualControl = ({ speed }) => {
    const dir = 0.1 * speed;
    return {
        vx: kontra.keys.pressed('right') ? dir : kontra.keys.pressed('left') ? -dir : 0,
        vy: kontra.keys.pressed('down') ? dir : kontra.keys.pressed('up') ? -dir : 0,
    }
}

const loop = kontra.gameLoop({  // create the main game loop
    update: function () {        // update the game state
        // Just dealing with player sprite right now, will move later
        sprite.update();

        // Wrap the sprites position when it reaches
        // the edge of the screen
        if (sprite.x > kontra.canvas.width) {
            sprite.x = -sprite.width;
        }

        // Normalize in all 8 directions
        const { vx, vy } = manualControl({ speed: 10 });
        const { nx, ny } = normalize({
            x: vx,
            y: vy
        }, 1);

        // Use 'ddx' when you need acc (which we don't right now)
        sprite.dx = nx;
        sprite.dy = ny;
        sprite.advance();
    },
    render: function () {        // render the game state
        sprite.render();
    }
});

loop.start();    // start the game