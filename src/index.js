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
import { normalize } from './helpers/vectorHelpers'
import { isOverlapping } from './helpers/collisionHelpers'
import { distance } from './helpers/physicsHelpers'

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

// Creates sprites using Kontra, adds them to a cache to be re-used for whatever needs them.
const SpriteFactory = (options = { _spriteCache: [] }) => {
    /* Try to keep sprites in containers so there's no risk of other things
    getting hold of them and weird visual stuff happening. Obviously if it's intended
    that's fine, but just beware.
    Wherever possible however, try to work only through the entity containers since they're
    the single source of truth for all 'things' in the game world. */
    return {
        createSprite: ({
            id,
            x,
            y,
            color
        }) => {
            const newSprite = kontra.sprite({
                id, x, y,
                color,  // fill color of the sprite rectangle
                width: 20,     // width and height of the sprite rectangle
                height: 40,
                //dx: 2          // move the sprite 2px to the right every frame
            })

            const existingCache = [newSprite].concat(options._spriteCache)

            if (existingCache.filter(item => item.id === id).length > 1) {
                console.warn('You are pushing sprites with the same ID, this is not recommended:', id);
            }

            options._spriteCache = Array.from([...new Set(existingCache.map(sprite => sprite.id))])
                .map(id => ({
                    id,
                    ...existingCache.find(item => item.id === id)
                }))

            return newSprite;
        },
        getSprites: () => options._spriteCache
    }
}

const sprites = SpriteFactory();

// Entity containers
/* Containers bring everything together, they make assumptions and coupling
but this should be the only place this needs to happen.
Any props that are from / use a lib will be prefixed with its name.
*/
const EntityContainer = ({
    id,
    type,
    color = 'red',
    pos = {
        x: 0,
        y: 0
    },
    stats,
    hitbox = {
        radius: 1
    }
}) => {
    // Using the factory we create a sprite matching the ID of this container (and props given)
    const kontraSprite = sprites.createSprite({ id, color, x: pos.x, y: pos.y })

    const _move = (x, y) => {
        // Normalize in all 8 directions
        const { nx, ny } = normalize({ x, y }, 1);

        // Use 'ddx' when you need acc (which we don't right now)
        kontraSprite.dx = nx;
        kontraSprite.dy = ny;
        kontraSprite.advance();
    }

    const _interact = () => {
        console.log('Looking around...');
    }

    const _update = () => {
        // Just dealing with player sprite right now, will move later
        kontraSprite.update();

        // Wrap the sprites position when it reaches
        // the edge of the screen
        if (kontraSprite.x > kontra.canvas.width) {
            kontraSprite.x = -kontraSprite.width;
        }
    }

    const _render = () => {
        kontraSprite.render();
    }

    return {
        // Info
        id,
        type,
        getStats: () => stats,
        // Kontra info (used to find out where we are in the world visually)
        x: () => kontraSprite.x,
        y: () => kontraSprite.y,
        width: kontraSprite.width, // TODO: Make use of hitbox, don't rely on sprite.
        height: kontraSprite.height,
        radius: hitbox.radius,
        // Actions
        move: ({ x, y }) => _move(x, y),
        interact: () => _interact(),
        // Kontra methods
        update: () => _update(),
        render: () => _render()
    }
}

// Can use a factory to populate this later on (from map data for example)
const entities = [
    EntityContainer({
        id: 'player-1',
        type: 'player', // TODO: Could use some consts here.
        color: 'red',
        pos: {
            x: 200,
            y: 50
        },
        stats: {
            health: {
                max: 100,
                min: 0,
                current: 50
            }
        },
        hitBox: {
            radius: 1
        }
    }),
    EntityContainer({
        id: 'box-1',
        type: 'box',
        color: 'blue',
        pos: {
            x: 100,
            y: 50
        },
        stats: {
            health: {
                max: 100,
                min: 0,
                current: 50
            }
        },
        hitBox: {
            radius: 1
        }
    }),
    EntityContainer({
        id: 'box-2',
        type: 'box',
        color: 'green',
        pos: {
            x: 170,
            y: 120
        },
        stats: {
            health: {
                max: 100,
                min: 0,
                current: 50
            }
        },
        hitBox: {
            radius: 1
        }
    })
]

const player = entities.find(({ id }) => id === 'player-1')

// Control managers
const manualControl = ({ speed }) => {
    const dir = 0.1 * speed;
    return {
        x: kontra.keys.pressed('right') ? dir : kontra.keys.pressed('left') ? -dir : 0,
        y: kontra.keys.pressed('down') ? dir : kontra.keys.pressed('up') ? -dir : 0,
    }
}

// Control bindings
kontra.keys.bind('e', () => {
    // player.interact((interestingData) => {
    //     console.log(interestingData);
    // });

    const overlappingWithPlayer = entities.filter(entity => {
        if (entity.type !== 'player') {
            // Circle vs circle detection (still being tested, needs to use hitboxes really),
            // at present props are a little confused with each other (x and y specifically).
            // So that part needs a little re-working.
            const a = {
                x: entity.x(),
                y: entity.y(),
                width: entity.width,
                radius: entity.radius
            }

            const b = {
                x: player.x(),
                y: player.y(),
                width: player.width,
                radius: player.radius
            }

            return isOverlapping(a, b)
        }

        return false;
    }).sort((a, b) =>
        distance({ x: a.x(), y: a.y() }, { x: player.x(), y: player.y() }) <
        distance({ x: b.x(), y: b.y() }, { x: player.x(), y: player.y() })
    );

    // With distance check applied also
    if (overlappingWithPlayer.length) {
        console.log('Do something with data...')
        console.log(overlappingWithPlayer[0])
    }

    // Useful for enemies
    // sprites = sprites.filter(sprite => sprite.isAlive());
})

// Main loop
const loop = kontra.gameLoop({
    update: () => {
        // Could just as easily be automatically controlled so we handle from outside.
        const pos = manualControl({ speed: 10 });
        player.move(pos);

        // Kontra note: Update must be called (container is entry point).
        entities.forEach(entity => entity.update());
    },
    render: () => {
        // Kontra note: Render must be called (container is entry point).
        entities.forEach(entity => entity.render());
    }
});

if (player) { loop.start(); } else {
    console.error('Loop didnt start.');
}