/*
Given a chosen action or reaction, we grab the state
from here and run it. Because it's a provider around the
entity container, it means we have access to all of the
other functions within, rather than it be removed.
*/
export default () => {
    return {
        decide: (availableEntities, me) => {
            // Pick a target (should never be the same as this)
            const myTarget = availableEntities[0]; // Will filter better later.

            // Return a decided action (whatever that is)
            return {
                action: 'attack',
                meta: {
                    target: myTarget,
                    origin: me
                }
            };
        }
    }
}