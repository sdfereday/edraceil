import { onHit } from '../../states/stateRegistry'

export default ({ id, globalBattleFSM, localFSM }) => {
    return {
        hit: ({ damage, origin }) => {
            console.log(id + ' got a hit from ' + origin + '.');

            localFSM.push(onHit({
                id,
                exitParams: {
                    onExit: () => {
                        // maybe stick counter here?
                    }
                }
            }));
        },
        counterHit: ({ damage, origin }) => {
            // Counter hits are same as normal hit but ensure it's not countered in turn.
            console.log(id + ' was countered by ' + origin + '.');

            localFSM.push(onHit({
                id
            }));
        }
    }
}