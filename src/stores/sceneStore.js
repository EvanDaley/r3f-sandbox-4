import create from 'zustand'
import WelcomeScreen from '../scenes/WelcomeScreen'
import HelloExampleScene from '../scenes/hello_example/HelloExampleScene'
import ColorTheory1 from '../scenes/throw_away/ColorTheory1'

const scenes = [
  { id: 'welcome', scene: WelcomeScreen },
  { id: 'helloExampleScene', scene: HelloExampleScene },
  { id: 'colorTheory1', scene: ColorTheory1 },
]

const defaultScene = 'colorTheory1'

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
