import { useState } from '../../helpers/stateHelpers'
import { fsm } from '../../states/machines/normalStateMachine'
import { onHit, onAttack, onCounter } from '../../states/stateRegistry'

export default ({ id }) => {
    const _internalActionFSM = fsm();
    const [sharedQueueFSM, setSharedQueueFSM] = useState(null);
    const [target, setTarget] = useState(null);

    return {
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
                sharedQueueFSM().push(counterState)
            }
        },
        counterHit: ({ }) => {
            // ?
        },
        decide: () => {
            // Run ai logic or just wait for manual input
            // We push to global action because we don't want it being interrupted by counters, etc.
            sharedQueueFSM().push(onAttack({
                ownerId: id,
                target: target(),
                name: id
            }))
        },
        setTarget: v => setTarget(v),
        subscribeGlobalQueue: v => setSharedQueueFSM(v), // TODO: Not overly happy about doing this.
        currentStateComplete: () => _internalActionFSM.currentStateComplete(),
        update: () => _internalActionFSM.update(),
        onTurnChanged: () => { }
    }
}