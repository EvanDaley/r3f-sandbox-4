// useBroadcastPositions.js

import { useEffect } from 'react'
import { usePeerStore } from '../../../stores/peerStore'
import { useBirdStore } from '../stores/birdStore'

export function useBroadcastPositions() {
    const TICKS_PER_SECOND = 10
    const TICK_RATE = 1000 / TICKS_PER_SECOND

    useEffect(() => {
        const interval = setInterval(() => {
            const { isHost, connections } = usePeerStore.getState()
            if (!isHost) return

            const { playerPositions } = useBirdStore.getState()
            const message = {
                scene: 'birdScene',
                type: 'positionsEvent',
                payload: { playerPositions }
            }

            Object.values(connections).forEach(({ conn }) => {
                if (conn?.open) conn.send(message)
            })
        }, TICK_RATE)

        return () => clearInterval(interval)
    }, [])
}
