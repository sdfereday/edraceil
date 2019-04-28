export default ({
    onBattleTurnChanged = (res) => { }
}) => {
    return {
        onBattleTurnChanged: res => onBattleTurnChanged(res)
    }
}