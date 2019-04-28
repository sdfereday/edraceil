import KontraProvider from './providers/kontraProvider';
import AiProvider from './providers/aiProvider';
import EventProvider from './providers/eventProvider';
import DamageCommands from './commands/damageCommands';
import AttackCommands from './commands/attackCommands';
import { fsm } from '../states/machines/normalStateMachine'

const Animator = () => {
    return {
        play: (anim) => {
            console.log('Play animation', anim);
        }
    }
}

const Mover = () => {
    return {
        task: (task) => {
            console.log('Do mover task', task);
        }
    }
}

export default ({
    id,
    type,
    ...props
}) => {
    const { spriteConfig, globalBattleFSM } = props;

    // FSM for local actions
    const localFSM = fsm();

    // Mannequine functions (use this to physically move the sprite)
    const mover = Mover();

    // Animator functions (use this to animate the sprite)
    const animator = Animator();

    // Providers this entity makes use of.
    const kontraProvider = KontraProvider({ spriteConfig });
    const aiProvider = AiProvider();
    const eventProvider = EventProvider({
        onBattleTurnChanged: () => {
            console.log('Battle turn changed.');
        }
    });

    // Expose this to anything that has the ability to instruct this entity
    const performCommand = ({ action, meta }) => {

        const command = entityCommands[action];

        if (command) {
            command({
                id,
                mover,
                animator,
                ...meta
            });
        }
    }

    // Commands that public can call from states, etc
    const damageCommands = DamageCommands({
        id,
        globalBattleFSM,
        localFSM,
        mover
    });

    const attackCommands = AttackCommands({
        id,
        globalBattleFSM,
        localFSM,
        mover
    })

    const entityCommands = {
        ...damageCommands,
        ...attackCommands
    }

    /// Any methods that need to make use of main game loop are extracted here (usually update or render).
    const fnMap = Object.values({
        kontraProvider,
        aiProvider,
        localFSM
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
        currentStateComplete: () => localFSM.currentStateComplete(),
        command: commandData => performCommand(commandData),
        ai: {
            ...aiProvider
        },
        kontra: {
            ...kontraProvider
        },
        events: {
            ...eventProvider
        }
    }
}