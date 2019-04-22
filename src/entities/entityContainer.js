import { normalize } from '../helpers/vectorHelpers'

export default ({
    id,
    type,
    stats,
    spriteConfig = {},
    actions = [],
    hitbox = { // TODO: Move this too?
        radius: 1
    },
    _kontraSprite = null // TODO: Create a sprite interface so implementation doesn't matter.
}) => {
    const _move = (x, y) => {
        if (!_kontraSprite) return;
        // Normalize in all 8 directions
        const { nx, ny } = normalize({ x, y }, 1);

        // Use 'ddx' when you need acc (which we don't right now)
        _kontraSprite.dx = nx;
        _kontraSprite.dy = ny;
        _kontraSprite.advance();
    }

    const _interact = (actionReq) => {
        if (!_kontraSprite) return;
        console.log(id, 'received signal to', actionReq);
        const chosenAction = actions.find(({ id }) => id === actionReq);

        if (chosenAction) {
            console.log('And found an action to match:');
            console.log(chosenAction);
        } else {
            console.log('But no action was found.');
        }
    }

    const _update = () => {
        if (!_kontraSprite) return;
        // Just dealing with player sprite right now, will move later
        _kontraSprite.update();

        // Wrap the sprites position when it reaches
        // the edge of the screen
        if (_kontraSprite.x > kontra.canvas.width) {
            _kontraSprite.x = -_kontraSprite.width;
        }
    }

    const _render = () => {
        if (!_kontraSprite) return;
        _kontraSprite.render();
    }

    return {
        // Info
        id,
        type,
        spriteConfig,
        getStats: () => stats,
        hitbox: () => hitbox,
        // Actions
        move: ({ x, y }) => _move(x, y),
        interact: (actionReq) => _interact(actionReq),
        // Kontra methods & info (used to find out where we are in the world visually)
        setSprite: (kSprite) => _kontraSprite = kSprite,
        x: () => _kontraSprite ? _kontraSprite.x : 0,
        y: () => _kontraSprite ? _kontraSprite.y : 0,
        width: () => _kontraSprite ? _kontraSprite.width : 0, // TODO: Make use of hitbox, don't rely on sprite.
        height: () => _kontraSprite ? _kontraSprite.height : 0,
        update: () => _update(),
        render: () => _render()
    }
}