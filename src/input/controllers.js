import kontra from 'kontra'

export const manualControl = ({ speed }) => {
    const dir = 0.1 * speed;
    return { // TODO: Like other areas, make an interface for stuff like this so it can be decoupled.
        x: kontra.keys.pressed('right') ? dir : kontra.keys.pressed('left') ? -dir : 0,
        y: kontra.keys.pressed('down') ? dir : kontra.keys.pressed('up') ? -dir : 0,
    }
}