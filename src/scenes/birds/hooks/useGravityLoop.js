// useGravityLoop.js
import { useFrame } from '@react-three/fiber'
import { useBirdStore } from '../stores/birdStore'
import { usePeerStore } from '../../../stores/peerStore'

export function useGravityLoop() {
    const GRAVITY = -9.8
    const FLOOR_Y = -2

    useFrame((state, delta) => {
        const { isHost } = usePeerStore.getState()
        if (!isHost) return

        const { playerPositions, updatePlayerPosition } = useBirdStore.getState()

        Object.entries(playerPositions).forEach(([peerId, [x, y, z]]) => {
            let newY = y + GRAVITY * delta
            if (newY < FLOOR_Y) newY = FLOOR_Y

            updatePlayerPosition(peerId, [x, newY, z])
        })
    })
}
