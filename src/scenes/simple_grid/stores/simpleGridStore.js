import create from 'zustand'
import { devtools } from 'zustand/middleware';

const storeName = `SimpleGridStore1-${Math.random().toString(36).substr(2, 5)}`;
console.log('my store is', storeName);

// Dev Considerations
// Instead of using vector coords as the main driver, should we use a 2x2 array?
// Ideally two people couldn't jump to the same square...


export const useSimpleGridStore = create(
    devtools(
        (set, get) => ({

            // State
            playerPositions: {},

            // Actions
            initializeScene: (startTime) =>
                set(
                    {
                        playerPositions: {},
                        sceneStartTime: startTime,
                        isInitialized: true,
                    },
                    false,
                    'initializeScene'
                ),

            updatePlayerPosition: (peerId, position) =>
                set(
                    (state) => ({
                        playerPositions: {
                            ...state.playerPositions,
                            [peerId]: position,
                        },
                    }),
                    false,
                    `updatePlayerPosition/${peerId}`
                ),

            initializePlayer: (peerId) => {
                console.log('Initialized player', peerId);

                const startingX = Math.ceil((Math.random() * 15) - 8)
                const startingY = 0
                const startingZ = Math.ceil((Math.random() * 15) - 8)
                const startingPos = [startingX, startingY, startingZ];

                set(
                    (state) => ({
                        playerPositions: {
                            ...state.playerPositions,
                            [peerId]: startingPos,
                        },
                    }),
                    false,
                    `initializePlayer/${peerId}`
                );

                console.log('Result', startingPos);
            },


            // Getters
            getPlayerPosition: (peerId) => get().playerPositions[peerId] || [0, 0, 0],

        }),
        { name: storeName }
    )
);
