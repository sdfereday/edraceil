import { useState } from '../helpers/stateHelpers'

const Store = (storeName) => {

    const [getter, setter] = useState({
        storeName
    });

    return {
        init: data => setter({
            storeName,
            ...data
        }),
        reset: () => setter({ storeName }),
        get: query => {
            return Object.values(getter()).find(({ id }) => id === query)
        }
    }
}

export default Store;