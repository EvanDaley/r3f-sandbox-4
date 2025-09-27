// useFlapControls.js
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useBirdStore } from '../stores/birdStore'
import { usePeerStore } from '../../../stores/peerStore'
import {routeMessage} from "../../../networking/MessageRouter";

export function useFlapControls() {
    useEffect(() => {
        const handleClick = () => {
            sendLocalPlayerClick()
        }

        window.addEventListener("pointerdown", handleClick)
        return () => window.removeEventListener("pointerdown", handleClick)
    }, [])


    function sendLocalPlayerClick() {
        const { connections, isHost, peerId } = usePeerStore.getState();

        if (isHost) {
            // Host sends a message to themselves via the message router
            routeMessage(peerId, {
                scene: 'birdScene',
                type: 'playerClick',
                payload: {}
            });
        } else {
            // Client sends to host (first connection that's not us)
            const hostConnection = Object.values(connections).find(({ conn }) => conn && conn.open);
            if (hostConnection) {
                hostConnection.conn.send({
                    scene: 'birdScene',
                    type: 'playerClick',
                    payload: {}
                });
            }
        }
    }


}
