import { useState } from '../../helpers/stateHelpers'

export default ({ stats }) => {
    // Status
    console.log(stats);
    const [health, setHealth] = useState(stats.health);
    const [susceptibleTo, setSusceptibleTo] = useState(stats.susceptibleTo);
    const [statuses, setStatuses] = useState([]);

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

    return {
        getStat: key => statTable[key].get(),
        setStat: (key, value) => _modifyStat(key, value),
    }
}