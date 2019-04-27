import EntityContainer from '../entities/entityContainer'

export const loadArea = (options = {
    query: '',
    fromTable: [],
    globalActionQueue: null,
    createSpriteMethod: (options) => { }
}) => {
    console.log('Querying area data for', options.query, 'using table data', options.fromTable);

    // Initialise the entity containers from data and binds sprite object
    const { query, fromTable, globalActionQueue, createSpriteMethod } = options;
    const entities = fromTable.find(({ id }) => id === query)
        .entities.map(entityData => {
            const { id, spriteConfig } = entityData;
            const container = EntityContainer(entityData);
            const newSprite = createSpriteMethod({
                id,
                ...spriteConfig
            })

            container.setSprite(newSprite);
            container.setGlobalQueue(globalActionQueue);
            return container;
        });

    // Expose util methods for future queries
    return {
        getEntities: () => entities,
        getEntity: query => entities.find(entity => entity.id === query)
    }
}