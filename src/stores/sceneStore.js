import create from 'zustand'
import WelcomeScreen from '../scenes/WelcomeScreen'
import SimpleSpellsScene from '../scenes/simple_spells/SimpleSpellsScene'

const scenes = [
  { id: 'welcome', scene: WelcomeScreen },
  { id: 'simpleSpells', scene: SimpleSpellsScene },
]

const defaultScene = 'welcome'

const useSceneStore = create(set => ({
  currentSceneId: defaultScene,
  scenes,
  setSceneId: (id) => set({ currentSceneId: id }),
  getCurrentSceneComponent: () => {
    const state = useSceneStore.getState()
    return scenes.find(s => s.id === state.currentSceneId)?.scene || null
  },
}))

export default useSceneStore
