export const areaTable = [
    {
        id: 'area-1',
        entities: [
            {
                // TODO: Player data wouldn't exist in here normally, will move later.
                id: 'player-1',
                type: 'player', // TODO: Could use some consts here.
                spriteConfig: {
                    color: 'red',
                    x: 30,
                    y: 30,
                    width: 20,
                    height: 40
                },
                equipment: [],
                stats: {
                    health: {
                        max: 100,
                        min: 0,
                        current: 50
                    },
                    susceptibleTo: [ // This should be changeable depending on equipment.
                        'poison'
                    ]
                },
                hitBox: {
                    radius: 1
                },
                actions: [
                    {
                        name: 'Attack',
                        id: 'attack-target',
                        do: [
                            // ... animations, functions, etc
                            {
                                state: 'onAttack'
                            }
                        ]
                    }
                ]
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
                equipment: [],
                stats: {
                    health: {
                        max: 100,
                        min: 0,
                        current: 50
                    },
                    susceptibleTo: []
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
                    x: 100,
                    y: 100,
                    width: 20,
                    height: 40
                },
                equipment: [],
                stats: {
                    health: {
                        max: 100,
                        min: 0,
                        current: 50
                    },
                    susceptibleTo: []
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
            },
            {
                id: 'gnoll-1',
                type: 'hostile',
                spriteConfig: {
                    color: 'orange',
                    x: 50,
                    y: 100,
                    width: 20,
                    height: 40
                },
                equipment: [],
                stats: {
                    health: {
                        max: 100,
                        min: 0,
                        current: 50
                    },
                    susceptibleTo: ['poison']
                },
                hitBox: {
                    radius: 1
                },
                actions: [
                    // {
                    //     name: 'Save The World',
                    //     id: 'save-the-world',
                    //     do: [
                    //         // ... animations, functions, etc
                    //     ]
                    // }
                ]
            }
        ]
    }
]