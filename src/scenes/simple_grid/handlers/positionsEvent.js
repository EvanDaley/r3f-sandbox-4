import {useSimpleGridStore} from "../stores/simpleGridStore";

export function positionsEvent(fromPeerId, payload) {
    console.log('positionsEvent payload', JSON.stringify(payload?.playerPositions))

    // // Update local state with click count from host
    const { updatePlayerPosition } = useSimpleGridStore().getState();

    // Set positions for all players
    Object.entries(payload?.playerPositions || {}).forEach(([peerId, playerPosition]) => {
        updatePlayerPosition(peerId, playerPosition);
    });
}