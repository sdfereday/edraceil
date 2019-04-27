import KontraProvider from './providers/kontraProvider';
import BattleProvider from './providers/battleProvider';

export default ({
    id,
    type,
    ...props
}) => {
    const { spriteConfig } = props;
    console.log(props);

    // Providers this entity makes use of.
    const kontraProvider = KontraProvider({ spriteConfig });
    const battleProvider = BattleProvider({ id });

    /// Any methods that need to make use of main game loop are extracted here (usually update or render).
    const fnMap = Object.values({
        kontraProvider,
        battleProvider
    }).map(({ update = () => { }, render = () => { } }) => {
        return {
            update,
            render
        }
    })

    // Anything returned here is exposed publically, use wisely to avoid method conflict.
    const { spriteInfo } = kontraProvider;

    return {
        id,
        type,
        spriteInfo,
        update: () => fnMap.map(({ update }) => update()),
        render: () => fnMap.map(({ render }) => render()),
        battle: {
            ...battleProvider
        },
        kontra: {
            ...kontraProvider
        }
    }
}