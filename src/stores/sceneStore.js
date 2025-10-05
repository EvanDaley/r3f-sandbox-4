import create from 'zustand'
import WelcomeScreen from '../scenes/WelcomeScreen'
import HelloExampleScene from '../scenes/hello_example/HelloExampleScene'
import ColorTheory2 from '../scenes/color_palette_2/ColorTheory2'

const scenes = [
  { id: 'welcome', scene: WelcomeScreen },
  { id: 'helloExampleScene', scene: HelloExampleScene },
  { id: 'colorTheory2', scene: ColorTheory2 },
]

const defaultScene = 'colorTheory2'

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
