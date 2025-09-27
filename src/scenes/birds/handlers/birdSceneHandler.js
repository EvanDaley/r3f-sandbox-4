// handlers/bird.js

import { useBirdStore } from '../stores/birdStore';
// import { useGlobalGameStore } from '../../../stores/globalGameStore';
import { usePeerStore } from '../../../stores/peerStore';

export function playerClick(fromPeerId, payload) {
    console.log(`Player ${fromPeerId} clicked in bird`);
    
    const { isHost } = usePeerStore.getState();
    
    if (isHost) {
        console.log('host received click event')
        // Host increments the click count
        const { incrementPlayerClicks, getPlayerClicks } = useBirdStore.getState();
        incrementPlayerClicks(fromPeerId);
        
        const newClickCount = getPlayerClicks(fromPeerId);
        console.log(`${fromPeerId} now has ${newClickCount} clicks`);

        // Figure out new position for the person that clicked
        const FLAP_STRENGTH = 3 // tune to feel right


        const { getPlayerPosition, updatePlayerPosition } = useBirdStore.getState()
        const [x, y, z] = getPlayerPosition(fromPeerId)
        const newPosition = [x, y + FLAP_STRENGTH, z]

        // Save the new position
        updatePlayerPosition(fromPeerId, newPosition)

        // Broadcast updated click count to all players
        broadcastClicksEvent(fromPeerId, newClickCount);
    }
}

export function clicksEvent(fromPeerId, payload) {
    const { peerId, clickCount } = payload;
    console.log(`Received click update: ${peerId} has ${clickCount} clicks`);
    
    // Update local state with click count from host
    const { updatePlayerClicks } = useBirdStore.getState();
    updatePlayerClicks(peerId, clickCount);
}

export function positionsEvent(fromPeerId, payload) {
    console.log('positionsEvent payload', JSON.stringify(payload?.playerPositions))

    // // Update local state with click count from host
    const { updatePlayerPosition } = useBirdStore.getState();

    // Set positions for all players
    Object.entries(payload?.playerPositions || {}).forEach(([peerId, playerPosition]) => {
        updatePlayerPosition(peerId, playerPosition);
    });
}

export function sceneInit(fromPeerId, payload) {
    const { startTime, playerData } = payload;
    console.log(`Bird initialization from host:`, payload);
    
    const { initializeScene, updatePlayerClicks, updatePlayerPosition } = useBirdStore.getState();
    initializeScene(startTime);
    
    // Set click counts for all players
    Object.entries(playerData.clickCounts || {}).forEach(([peerId, clickCount]) => {
        updatePlayerClicks(peerId, clickCount);
    });

    // Set positions for all players
    Object.entries(playerData.playerPositions || {}).forEach(([peerId, playerPosition]) => {
        updatePlayerPosition(peerId, playerPosition);
    });
}

function broadcastClicksEvent(peerId, clickCount) {
    const { connections } = usePeerStore.getState();
    
    const message = {
        scene: 'birdScene',
        type: 'clicksEvent',
        payload: { peerId, clickCount }
    };
    
    Object.values(connections).forEach(({ conn }) => {
        if (conn && conn.open) {
            conn.send(message);
        }
    });
}