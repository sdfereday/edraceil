import { onAttack, onCounter } from '../../states/stateRegistry'

export default ({ id, globalBattleFSM, mover }) => {
    return {
        attack: props => globalBattleFSM.push(onAttack({
            id,
            mover,
            ...props
        })),
        counter: props => globalBattleFSM.push(onCounter({
            id,
            mover,
            ...props
        }))
    }
}