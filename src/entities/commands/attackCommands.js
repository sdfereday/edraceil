import { onAttack } from '../../states/stateRegistry'

export default ({ id, globalBattleFSM, mover }) => {
    return {
        attack: props => globalBattleFSM.push(onAttack({
            id,
            mover,
            ...props
        }))
    }
}