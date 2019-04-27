import kontra from 'kontra'
import { normalize } from '../../helpers/vectorHelpers'

export default ({
    spriteConfig,
    hitbox = {
        radius: 1
    }
}) => {
    const sprite = kontra.sprite(spriteConfig);

    const _move = (x, y) => {
        if (!sprite) return;
        // Normalize in all 8 directions
        const { nx, ny } = normalize({ x, y }, 1);

        // Use 'ddx' when you need acc (which we don't right now)
        sprite.dx = nx;
        sprite.dy = ny;
        sprite.advance();
    }

    const _update = () => {
        if (!sprite) return;
        // Just dealing with player sprite right now, will move later
        sprite.update();

        // Wrap the sprites position when it reaches
        // the edge of the screen
        if (sprite.x > kontra.canvas.width) {
            sprite.x = -sprite.width;
        }
    }

    const _render = () => {
        if (!sprite) return;
        sprite.render();
    }

    return {
        spriteInfo: {
            x: () => sprite ? sprite.x : 0,
            y: () => sprite ? sprite.y : 0,
            width: () => sprite ? sprite.width : 0, // TODO: Make use of hitbox, don't rely on sprite.
            height: () => sprite ? sprite.height : 0,
            hitbox: () => hitbox
        },
        move: ({ x, y }) => _move(x, y),
        update: () => _update(),
        render: () => _render()
    }
}