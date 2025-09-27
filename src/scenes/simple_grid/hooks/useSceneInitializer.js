import { useEffect } from 'react';
import {usePeerStore} from "../../../stores/peerStore";
import {useSimpleGridStore} from "../stores/simpleGridStore";

export const useSceneInitializer = () => {
    const { connections, isHost, peerId } = usePeerStore();
    const { isInitialized, initializeScene, initializePlayer } = useSimpleGridStore()

    // Initialize players if any of the dependencies have changed
    useEffect(() => {
        if (isHost && !isInitialized) {
            const startTime = Date.now();
            initializeScene(startTime);

            // Initialize all connected players (locally)
            Object.keys(connections).forEach(playerId => {
                initializePlayer(playerId);
            });

            // Broadcast initialization to all clients
            broadcastSceneInit(startTime);
        }
    }, [isHost, isInitialized, connections, peerId]);
}

function broadcastSceneInit(startTime) {
    const { connections } = usePeerStore.getState();
    const { playerPositions } = useSimpleGridStore.getState();

    const message = {
        scene: 'gridScene',
        type: 'sceneInitEvent',
        payload: {
            startTime,
            playerData: {
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