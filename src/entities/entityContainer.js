import { normalize } from '../helpers/vectorHelpers'
import { useState } from '../helpers/stateHelpers'
import { fsm } from '../states/machines/normalStateMachine'
import { onHit, onAttack, onCounter } from '../states/stateRegistry'

export default ({
    id,
    type,
    stats,
    spriteConfig = {},
    actions = [],
    hitbox = { // TODO: Move this too?
        radius: 1
    },
    _globalActionQueue = null,
    _internalActionFSM = fsm(),
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
        _internalActionFSM.update();
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
        hit: ({ damage, originData }) => {
            console.log(id + ' got a hit from ' + originData.name + '.')
            const hitState = onHit({
                ownerId: id,
                name: id,
                exitParams: {
                    onExit: () => {
                        // maybe stick counter here?
                    }
                }
            })

            _internalActionFSM.push(hitState)

            // Simulates a counter (should happen after hit has exited)
            /// NOTE: The reason we have a global queue? So when someone
            /// presses a counter, it doesn't do it whilst the attack's finishing.
            if (1) {
                console.log(id + ' decided to counter ' + originData.name + '.')

                const counterState = onCounter({
                    ownerId: id,
                    target: target(),
                    name: id
                })

                // So this should be either in a latent queue fired between turns,
                // or stuck in a global thing.
                _globalActionQueue.push(counterState)
            }
        },
        counterHit: ({ }) => {
            // ?
        },
        decide: () => {
            // Run ai logic or just wait for manual input
            // We push to global action because we don't want it being interrupted by counters, etc.
            _globalActionQueue.push(onAttack({
                ownerId: id,
                target: target(),
                name: id
            }))
        },
        setTarget: v => setTarget(v),
        setGlobalQueue: v => _globalActionQueue = v,
        currentStateComplete: () => _internalActionFSM.currentStateComplete(),
        onTurnChanged: () => { },

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