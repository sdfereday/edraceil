import EntityContainer from '../entities/entityContainer'

export const loadArea = (options = {
    query: '',
    fromTable: []
}) => {
    console.log('Querying area data for', options.query, 'using table data', options.fromTable);

    // Initialise the entity containers from data and binds sprite object
    const { query, fromTable } = options;
    const entities = fromTable.find(({ id }) => id === query)
        .entities.map(entityRaw => EntityContainer({ ...entityRaw }));

    // Expose util methods for future queries
    return {
        getEntities: () => entities,
        getEntity: query => entities.find(entity => entity.id === query)
    }
}