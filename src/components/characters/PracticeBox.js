import React, { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

function asset(path) {
    const base = window.location.pathname.replace(/\/$/, '')
    return `${base}${path}`
}

export default function PracticeBox(props) {
    const { scene, animations } = useGLTF(asset('/models/box.glb'))
    const clonedScene = useMemo(() => scene.clone(), [scene])

    // Hook into animations
    const { actions } = useAnimations(animations, clonedScene)

    useEffect(() => {
        if (actions) {
            // Play the first animation
            const [firstAction] = Object.values(actions)
            firstAction?.reset().play()
        }
    }, [actions])

    return <primitive object={clonedScene} {...props} />
}

useGLTF.preload(asset('/models/box.glb'))