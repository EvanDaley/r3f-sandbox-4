// useBirdGame.js
import { useEffect } from 'react';
import { useBirdStore } from '../stores/birdStore';
import { usePeerStore } from '../../../stores/peerStore';
import { routeMessage } from '../../../networking/MessageRouter';
import { useFrame } from '@react-three/fiber'

export const useBirdGame = () => {
    const { clickCounts, isInitialized, initializeScene, initializePlayer } = useBirdStore();
    const { connections, isHost, peerId } = usePeerStore();

    // Initialize scene when it loads
    useEffect(() => {
        if (isHost && !isInitialized) {
            const startTime = Date.now();
            initializeScene(startTime);

            // Initialize all connected players
            Object.keys(connections).forEach(playerId => {
                initializePlayer(playerId);
            });

            // Broadcast initialization to all clients
            broadcastSceneInit(startTime);
        }
    }, [isHost, isInitialized, connections, peerId]);

    // Handle click events
    const handleClick = () => {
        sendLocalPlayerClick();
    };

    // Map names back onto the clicks. The click array is just ids and click counts
    const getPlayerNames = () => {
        const playerNames = {};
        Object.keys(clickCounts).forEach(playerId => {
            playerNames[playerId] = connections[playerId]?.name || 'Unknown';
        });
        return playerNames;
    };

    return {
        clickCounts,
        handleClick,
        playerNames: getPlayerNames(),
        isInitialized
    };
};

function broadcastSceneInit(startTime) {
    const { connections } = usePeerStore.getState();
    const { clickCounts, playerPositions } = useBirdStore.getState();
    
    const message = {
        scene: 'birdScene',
        type: 'sceneInit',
        payload: { 
            startTime,
            playerData: {
                clickCounts,
                playerPositions
            }
        }
    };

    Object.values(connections).forEach(({ conn }) => {
        if (conn && conn.open) {
            conn.send(message);
        }
    });
}