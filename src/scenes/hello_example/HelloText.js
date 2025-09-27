import * as THREE from 'three'
import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

const normalMaterial = new THREE.MeshNormalMaterial()
const innerMaterial = new THREE.MeshDepthMaterial()

const MODEL_PATHS = {
    fragments: window.location.href + '/models/hello_example/hello-fragments.glb',
    text: window.location.href + '/models/hello_example/hello-text.glb',
}

// useGLTF.preload(MODEL_PATHS.fragments)
// useGLTF.preload(MODEL_PATHS.text)

export function HelloFragments({ visible, ...props }) {
    const group = useRef()
    const { scene, animations, materials } = useGLTF(MODEL_PATHS.fragments)
    const { actions } = useAnimations(animations, group)

    useMemo(() => {
        scene.traverse((o) => {
            if (o.type === 'Mesh' && o.material === materials.inner) {
                o.material = normalMaterial
            }
        })
    }, [scene, materials])  // include dependencies

    useEffect(() => {
        console.log(visible)
        if (visible) {
            Object.values(actions).forEach((action) => {
                action.reset().play()
                action.repetitions = 0
                action.clampWhenFinished = true
            })
        } else {
            // Object.values(actions).forEach((action) => {
            //     action.stop()
            //     action.reset()   // rewinds to frame 0
            // })
            // // Reset transforms on the scene if needed
            // scene.traverse((o) => {
            //     if (o.isMesh || o.isGroup) {
            //         o.position.set(0, 0, 0)
            //         o.rotation.set(0, 0, 0)
            //         o.scale.set(1, 1, 1)
            //     }
            // })
        }
    }, [visible, actions, scene])

    return <primitive ref={group} object={scene} {...props} />
}

export function HelloModel(props) {
    const { scene } = useGLTF(MODEL_PATHS.text)
    return <primitive object={scene} {...props} />
}
