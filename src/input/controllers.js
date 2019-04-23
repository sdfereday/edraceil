const _move = ({ speed, keyPressedHandler, right, left, up, down }) => {
    const dir = 0.1 * speed;
    return {
        x: keyPressedHandler(right) ? dir : keyPressedHandler(left) ? -dir : 0,
        y: keyPressedHandler(down) ? dir : keyPressedHandler(up) ? -dir : 0,
    }
}

export default {
    init: ({
        _disabled = false,
        bindings = [],
        keyPressedHandler = (key) => {},
        keyMap = {
            right: 'right',
            left: 'left',
            down: 'down',
            up: 'up',
            interact: 'e'
        }
    }) => {
        bindings.map(({ bind = 'key', to = () => {}, keyBindingMethod = () => {} }) => keyBindingMethod(bind, to))

        return {
            enabled: state => _disabled = state,
            move: ({ speed }) => !_disabled && _move({ speed, keyPressedHandler, ...keyMap })
        }
    }
}