/*
So since we're in the field state at the moment (this is determined at the top),
we'll interact with things and expect some sort of feedback whether it be opening
doors, talking or trigger the battle module.

Simply put, the type/id of thing interacted with will map back to an action map, which,
for now will just be in here.

This could exist in the global context for events or in battle too.

By default the map focuses on the type, but if an ID is given, then it's assumed a special
route must be used.
*/

// 'Should' match up to id's of action on entities. These will all come from the same
// place eventually probably.
// You might even import this table via json or other means outside of this map.
const actionMap = [
    {
        name: 'Open Box', // Meta
        actionId: 'open-box', // Matched action to perform
        triggeredByType: 'box',
        triggeredById: null
    },
    {
        name: 'Save The World',
        actionId: 'save-the-world',
        triggeredByType: null,
        triggeredById: 'box-2'
    }
]

export const getAction = ({ type, id }) => {
    const actionById = actionMap.find(({ triggeredById }) => triggeredById === id);

    if (actionById) {
        return actionById.actionId;
    }

    const actionByType = actionMap.find(({ triggeredByType }) => triggeredByType === type);
    return actionByType ? actionByType.actionId : null;
}
