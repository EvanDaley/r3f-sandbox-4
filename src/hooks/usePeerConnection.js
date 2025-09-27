// usePeerConnection.js
import { useEffect, useState } from 'react';
import { initPeer, connectToPeer } from '../networking/PeerManager';
import { usePeerStore } from '../stores/peerStore';
import {broadcastSceneChange} from "../networking/sceneUtils";
import useSceneStore from "../stores/sceneStore";

export default function usePeerConnection() {
    const { scenes, currentSceneId, setSceneId } = useSceneStore();

    const [hostId, setHostId] = useState('');
    const peerId = usePeerStore(state => state.peerId);
    const playerName = usePeerStore(state => state.playerName);
    const setPlayerName = usePeerStore(state => state.setPlayerName);
    const connections = usePeerStore(state => state.connections);
    const isHost = usePeerStore(state => state.isHost);

    const isConnected = Object.keys(connections).length > 0;

    useEffect(() => {
        initPeer(() => {});
    }, []);

    const handleConnect = () => {
        if (!hostId.trim()) return;
        connectToPeer(hostId.trim(), () => setHostId(''));
    };

    const handleSceneChange = (sceneId) => {
        setSceneId(sceneId);
        broadcastSceneChange(sceneId);
    };

    return {
        peerId,
        playerName,
        connections,
        isConnected,
        hostId,
        setHostId,
        setPlayerName,
        handleConnect,
        isHost,
        handleSceneChange
    };
}
