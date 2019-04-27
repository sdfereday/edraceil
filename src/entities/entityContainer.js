import { normalize } from '../helpers/vectorHelpers'
import { useState } from '../helpers/stateHelpers'
import { fsm } from '../states/normalStateMachine'
import { onHit, onAttack } from '../states/stateRegistry'

export default ({
    id,
    type,
    stats,
    spriteConfig = {},
    actions = [],
    hitbox = { // TODO: Move this too?
        radius: 1
    },
    _actionFsm = fsm(),
    _kontraSprite = null // TODO: Create a sprite interface so implementation doesn't matter.
}) => {

    /// Internal state
    // Status
    console.log(stats);
    const [health, setHealth] = useState(stats.health);
    const [susceptibleTo, setSusceptibleTo] = useState(stats.susceptibleTo);
    const [statuses, setStatuses] = useState([]);

    // Battle
    const [target, setTarget] = useState(null);

    /// Access table for stats
    const statTable = {
        susceptibleTo: {
            get: susceptibleTo,
            set: () => { }
        },
        health: {
            get: health,
            set: (k, v) => setHealth({
                ...stats.health,
                current: v
            })
        },
        status: {
            get: statuses,
            set: (k, v) => !statuses().some(status => status.type === v.type) && setStatuses([
                ...statuses(),
                v
            ])
        }
    }

    /// Internal methods
    const _modifyStat = (key, value) => {
        const stat = statTable[key];

        if (stat) {
            stat.set(key, value);
        }
    }

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

        // Unsure..
        _actionFsm.update();
    }

    const _render = () => {
        if (!_kontraSprite) return;
        _kontraSprite.render();
    }

    /// Public properties (hocs or providers would be good here)
    return {
        // Info
        id,
        type,
        spriteConfig,
        getStat: key => statTable[key].get(),
        setStat: (key, value) => _modifyStat(key, value),
        hitbox: () => hitbox,
        
        // Actions
        move: ({ x, y }) => _move(x, y),
        interact: (actionReq) => _interact(actionReq),

        // State actions (animator called from within state)
        push: (stateName) => {
            if (stateName === 'battle.onAttack') {
                _actionFsm.push(onAttack({
                    ownerId: id,
                    target: _target,
                    name
                }))
            }
        },
        hit: ({ damage, originData }) => {
            console.log(id + ' got a hit from ' + originData.name + '.')
            const hitState = onHit({
                ownerId: id,
                name,
                exitParams: {
                    onExit: () => {
                        // globalFSM.push(counterState)
                    }
                }
            })

            _actionFsm.push(hitState)
        },
        decide: () => {
            // ... ?
            _actionFsm.push(onAttack({
                ownerId: id,
                target: target(),
                name: id
            }))
        },
        counter: () => {
            // ... ?
        },
        setTarget: v => setTarget(v),
        currentStateComplete: () => _actionFsm.currentStateComplete(),
        onTurnChanged: () => {},
        
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