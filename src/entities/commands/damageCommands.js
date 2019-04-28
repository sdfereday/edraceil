import { onHit, onCounter } from '../../states/stateRegistry'

export default ({ id, globalBattleFSM, localFSM, mover }) => {
    return {
        hit: ({ damage, origin }) => {
            /// TODO: Get the entities from a pool, don't pass them around.
            // Who hit me?
            console.log(id + ' got a hit from ' + origin.id + '.');

            localFSM.push(onHit({
                id,
                exitParams: {
                    onExit: () => {
                        // maybe stick counter here?
                    }
                }
            }));

            // Simulates a counter (should happen after hit has exited)
            /// NOTE: The reason we have a global queue? So when someone
            /// presses a counter, it doesn't do it whilst the attack's finishing.
            if (1) {
                console.log(id + ' decided to counter ' + origin.id + '.');

                const counterState = onCounter({
                    id,
                    target: origin,
                    mover
                });

                // So this should be either in a latent queue fired between turns,
                // or stuck in a global thing.
                globalBattleFSM.push(counterState);
            }
        },
        counterHit: ({ damage, originId }) => {
            // Counter hits are same as normal hit but ensure it's not countered in turn.
            console.log(id + ' was countered by ' + originId + '.');

            localFSM.push(onHit({
                id,
                exitParams: {
                    onExit: () => {
                        // maybe stick counter here?
                    }
                }
            }));
        }
    }
}