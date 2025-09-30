import React, { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

const MODEL_PATH = window.location.href + '/models/color_palette/Mineral1.glb'

export default function ExampleGeode(props) {
    const { scene } = useGLTF(MODEL_PATH)
    scene.traverse((child) => {
        if (child.isMesh) {
            child.material.metalness = 1
            child.material.roughness = 0.1
            child.material.envMapIntensity = 1.5
        }
    })
    return <primitive object={scene} {...props} />
}

useGLTF.preload(MODEL_PATH)