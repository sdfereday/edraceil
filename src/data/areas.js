export const areaTable = [
    {
        id: 'area-1',
        entities: [
            {
                id: 'player-1',
                type: 'player', // TODO: Could use some consts here.
                spriteConfig: {
                    color: 'red',
                    x: 200,
                    y: 50,
                    width: 20,
                    height: 40
                },
                stats: {
                    health: {
                        max: 100,
                        min: 0,
                        current: 50
                    }
                },
                hitBox: {
                    radius: 1
                }
            },
            {
                id: 'box-1',
                type: 'box',
                spriteConfig: {
                    color: 'blue',
                    x: 100,
                    y: 50,
                    width: 20,
                    height: 40
                },
                stats: {
                    health: {
                        max: 100,
                        min: 0,
                        current: 50
                    }
                },
                hitBox: {
                    radius: 1
                },
                actions: [
                    {
                        name: 'Open',
                        id: 'open-box',
                        do: [
                            // ... animations, functions, etc
                        ]
                    }
                ]
            },
            {
                id: 'box-2',
                type: 'box',
                spriteConfig: {
                    color: 'green',
                    x: 170,
                    y: 120,
                    width: 20,
                    height: 40
                },
                stats: {
                    health: {
                        max: 100,
                        min: 0,
                        current: 50
                    }
                },
                hitBox: {
                    radius: 1
                },
                actions: [
                    {
                        name: 'Save The World',
                        id: 'save-the-world',
                        do: [
                            // ... animations, functions, etc
                        ]
                    }
                ]
            }
        ]
    }
]