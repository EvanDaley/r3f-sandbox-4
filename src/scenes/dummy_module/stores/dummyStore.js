import create from 'zustand'
import { devtools } from 'zustand/middleware';

const storeName = `DummyStore1-${Math.random().toString(36).substr(2, 5)}`;
console.log('my store is', storeName);

export const useDummyStore = create(
    devtools(
        (set, get) => ({

            // State

            // Actions

            // Getters


        }),
        { name: storeName }
    )
);
