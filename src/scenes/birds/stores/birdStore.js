// birdStore.js
import create from 'zustand';
import { devtools } from 'zustand/middleware';

const storeName = `BirdStore1-${Math.random().toString(36).substr(2, 5)}`;
console.log('my store is', storeName);

const highPoint = 20
const lowPoint = 15

export const useBirdStore = create(
    devtools(
        (set, get) => ({
            clickCounts: {}, // { peerId: clickCount }
            sceneStartTime: null,
            isInitialized: false,
            playerPositions: {},

            // Actions
            initializeScene: (startTime) =>
                set(
                    {
                        clickCounts: {},
                        playerPositions: {},
                        sceneStartTime: startTime,
                        isInitialized: true,
                    },
                    false,
                    'initializeScene'
                ),

            updatePlayerClicks: (peerId, clickCount) =>
                set(
                    (state) => ({
                        clickCounts: {
                            ...state.clickCounts,
                            [peerId]: clickCount,
                        },
                    }),
                    false,
                    `updatePlayerClicks/${peerId}`
                ),

            incrementPlayerClicks: (peerId) =>
                set(
                    (state) => ({
                        clickCounts: {
                            ...state.clickCounts,
                            [peerId]: (state.clickCounts[peerId] || 0) + 1,
                        },
                    }),
                    false,
                    `incrementPlayerClicks/${peerId}`
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

                const startingX = Math.random() * (2) - 1
                const startingY = Math.random() * (highPoint - lowPoint) + lowPoint
                const startingPos = [startingX, startingY, 0];

                set(
                    (state) => ({
                        clickCounts: {
                            ...state.clickCounts,
                            [peerId]: state.clickCounts[peerId] || 0,
                        },
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

            reset: () =>
                set(
                    {
                        playerPositions: {},
                        clickCounts: {},
                        sceneStartTime: null,
                        isInitialized: false,
                    },
                    false,
                    'reset'
                ),

            // Getters
            getPlayerClicks: (peerId) => get().clickCounts[peerId] || 0,
            getTotalClicks: () => {
                const clicks = get().clickCounts;
                return Object.values(clicks).reduce((sum, count) => sum + count, 0);
            },
            getClickLeaderboard: () => {
                const clicks = get().clickCounts;
                return Object.entries(clicks).sort(([, a], [, b]) => b - a);
            },
            getPlayerPosition: (peerId) =>
                get().playerPositions[peerId] || [0, 0, 0],
        }),
        { name: storeName }
    )
);
