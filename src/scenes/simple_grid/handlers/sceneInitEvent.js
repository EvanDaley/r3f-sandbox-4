// scenes/simple_grid/handlers/sceneInitEvent.js
import { useSimpleGridStore } from "../stores/simpleGridStore";

export function sceneInitEvent(fromPeerId, payload) {
    const { startTime, playerData } = payload;
    console.log(`Scene initialization from host:`, payload);

    const { initializeScene, updatePlayerPosition } = useSimpleGridStore.getState();

    // Initialize scene with host's startTime
    initializeScene(startTime);

    // Set positions for all players
    Object.entries(playerData.playerPositions || {}).forEach(([peerId, playerPosition]) => {
        updatePlayerPosition(peerId, playerPosition);
    });
}
