import React, { useMemo, useRef } from 'react'
import {Box, useGLTF} from '@react-three/drei'
import PulsingLight from "../../scenes/simple_grid/objects/PulsingLight";

function asset(path) {
    const base = window.location.pathname.replace(/\/$/, '')
    return `${base}${path}`
}

export default function HoverCar1(props) {
    const { scene } = useGLTF(asset('/models/hoverCar1.glb'))
    const clonedScene = useMemo(() => scene.clone(), [scene])
    const carRef = useRef()

    const lightPosition = [-.1, 4.6, -1.8]

    return (
        <group {...props}>
            {/* Hovercar */}
            <primitive ref={carRef} object={clonedScene} />

            {/* Light as a child → always follows car */}
            <PulsingLight position={lightPosition} />

            {/*Useful for debugging the light position*/}
            {/*<Box scale={[.1,.1,.1]} position={lightPosition} />*/}
        </group>
    )
}

useGLTF.preload(asset('/models/hoverCar1.glb'))
