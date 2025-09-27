import * as THREE from 'three'
import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

const normalMaterial = new THREE.MeshNormalMaterial()

// Centralized paths (adjust them to reflect where your .glb files are actually located under public/)
const MODEL_PATHS = {
    fragments: window.location.href + '/models/hello_example/hello-fragments.glb',
    text: window.location.href + '/models/hello_example/hello-text.glb',
}

// Preload models
useGLTF.preload(MODEL_PATHS.fragments)
useGLTF.preload(MODEL_PATHS.text)

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
        if (visible) {
            Object.values(actions).forEach((action) => {
                action.repetitions = 0
                action.clampWhenFinished = true
                action.play()
            })
        }
    }, [visible, actions])

    return <primitive ref={group} object={scene} {...props} />
}

export function HelloModel(props) {
    const { scene } = useGLTF(MODEL_PATHS.text)
    return <primitive object={scene} {...props} />
}
