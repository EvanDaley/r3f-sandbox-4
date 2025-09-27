// handlers/scene1.js

import { useScene1Store } from '../../stores/scene1Store';
import { useGlobalGameStore } from '../../stores/globalGameStore';
import { usePeerStore } from '../../stores/peerStore';

export function playerClick(fromPeerId, payload) {
    console.log(`Player ${fromPeerId} clicked in scene1`);
    
    const { isHost } = usePeerStore.getState();
    
    if (isHost) {
        // Host increments the click count
        const { incrementPlayerClicks, getPlayerClicks } = useScene1Store.getState();
        incrementPlayerClicks(fromPeerId);
        
        const newClickCount = getPlayerClicks(fromPeerId);
        console.log(`${fromPeerId} now has ${newClickCount} clicks`);
        
        // Broadcast updated click count to all players
        broadcastClicksEvent(fromPeerId, newClickCount);
    }
}

export function clicksEvent(fromPeerId, payload) {
    const { peerId, clickCount } = payload;
    console.log(`Received click update: ${peerId} has ${clickCount} clicks`);
    
    // Update local state with click count from host
    const { updatePlayerClicks } = useScene1Store.getState();
    updatePlayerClicks(peerId, clickCount);
}

export function sceneInit(fromPeerId, payload) {
    const { startTime, playerData } = payload;
    console.log(`Scene1 initialization from host:`, payload);
    
    // Initialize scene with host's data
    const { initializeScene, updatePlayerClicks } = useScene1Store.getState();
    initializeScene(startTime);
    
    // Set click counts for all players
    Object.entries(playerData.clickCounts || {}).forEach(([peerId, clickCount]) => {
        updatePlayerClicks(peerId, clickCount);
    });
}

function broadcastClicksEvent(peerId, clickCount) {
    const { connections } = usePeerStore.getState();
    
    const message = {
        scene: 'scene1',
        type: 'clicksEvent',
        payload: { peerId, clickCount }
    };
    
    Object.values(connections).forEach(({ conn }) => {
        if (conn && conn.open) {
            conn.send(message);
        }
    });
}