// scene1Store.js
import create from 'zustand';
import { devtools } from 'zustand/middleware';

const storeName = `Scene1Store-${Math.random().toString(36).substr(2, 5)}`;

export const useScene1Store = create(devtools((set, get) => ({
    clickCounts: {}, // { peerId: clickCount }
    sceneStartTime: null,
    isInitialized: false,

    // Actions
    initializeScene: (startTime) =>
        set({
            clickCounts: {},
            sceneStartTime: startTime,
            isInitialized: true,
        }),

    updatePlayerClicks: (peerId, clickCount) =>
        set((state) => ({
            clickCounts: {
                ...state.clickCounts,
                [peerId]: clickCount,
            },
        })),

    incrementPlayerClicks: (peerId) =>
        set((state) => ({
            clickCounts: {
                ...state.clickCounts,
                [peerId]: (state.clickCounts[peerId] || 0) + 1,
            },
        })),

    initializePlayer: (peerId) =>
        set((state) => ({
            clickCounts: {
                ...state.clickCounts,
                [peerId]: state.clickCounts[peerId] || 0,
            },
        })),

    reset: () => set({
        clickCounts: {},
        sceneStartTime: null,
        isInitialized: false,
    }),

    // Getters
    getPlayerClicks: (peerId) => get().clickCounts[peerId] || 0,
    getTotalClicks: () => {
        const clicks = get().clickCounts;
        return Object.values(clicks).reduce((sum, count) => sum + count, 0);
    },
    getClickLeaderboard: () => {
        const clicks = get().clickCounts;
        return Object.entries(clicks)
            .sort(([,a], [,b]) => b - a);
    },
}), { name: storeName }));

