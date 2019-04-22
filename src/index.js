/// Libraries
/* Kontra is currently being tested, and should be swappable if a more adequate engine is found. It also doesn't
support module loading so at present so we're using webpacks export-loader. */
import kontra from 'kontra'

/// Helpers
import { isOverlapping } from './helpers/collisionHelpers'
import { distance } from './helpers/physicsHelpers'

/// Input
import { manualControl } from './input/controllers'

/// Map Data
import { areaTable } from './data/areas'
import { loadArea } from './map/mapLoader'

/// Actions
import { getAction } from './modules/field/actionMap'

/// Modules
/* At present our modules shouldn't be bothered about 'how' the game loop runs, just that it does run.
Ideally, we want to pass the graphics work to somewhere else, whilst these modules for example will
just generated data, and separate any concerns.*/
// import { startField } from './modules/field/module';
// import { startBattle } from './modules/battle/module';

/// Kontra setup (MUST happen first)
const canvasElement = document.getElementById('canvas');
// Init the kontra engine (MUST happen before you start instancing entities)
kontra.init(canvasElement);

/// EXPECTED: Kontra should be initialised at this point!
// Load area and expose util methods
const { getEntities, getEntity } = loadArea({
    query: 'area-1',
    fromTable: areaTable,
    createSpriteMethod: kontra.sprite
});

// Apply reference to area entities and assign the player entity
const entities = getEntities();
const player = getEntity('player-1')

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

        return false;
    }).sort((a, b) =>
        distance({ x: a.x(), y: a.y() }, { x: player.x(), y: player.y() }) <
        distance({ x: b.x(), y: b.y() }, { x: player.x(), y: player.y() })
    );

    // With distance check applied also
    if (overlappingWithPlayer.length) {
        const entity = overlappingWithPlayer[0];
        const actionReq = getAction({
            id: entity.id,
            type: entity.type
        });

        entity.interact(actionReq);
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