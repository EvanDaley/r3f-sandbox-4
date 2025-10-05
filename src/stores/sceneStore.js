import create from 'zustand'
import WelcomeScreen from '../scenes/WelcomeScreen'
import HelloExampleScene from '../scenes/hello_example/HelloExampleScene'
import ColorTheory1 from '../scenes/color_palette_1/ColorTheory1'
import ColorTheory2 from '../scenes/color_palette_2/ColorTheory2'
import ColorTheory3 from '../scenes/color_palette_3/ColorTheory3'

const scenes = [
  { id: 'welcome', scene: WelcomeScreen },
  { id: 'helloExampleScene', scene: HelloExampleScene },
  { id: 'colorTheory1', scene: ColorTheory1 },
  { id: 'colorTheory2', scene: ColorTheory2 },
  { id: 'colorTheory3', scene: ColorTheory3 },
]

const defaultScene = 'helloExampleScene'

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
