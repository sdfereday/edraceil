export const getAction = ({ type, id, actionTable }) => {
    const actionById = actionTable.find(({ triggeredById }) => triggeredById === id);

    if (actionById) {
        return actionById.actionId;
    }

    const actionByType = actionTable.find(({ triggeredByType }) => triggeredByType === type);
    return actionByType ? actionByType.actionId : null;
}
