import * as THREE from 'three'
import React, { Suspense, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera, Preload, useCursor } from '@react-three/drei'
import { HelloModel, HelloFragments } from './HelloText'

function HelloScene() {
    const vec = new THREE.Vector3()
    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [animating, setAnimating] = useState(false)

    useCursor(hovered)

    useFrame((state) => {
        if (!animating) return

        const target = vec.set(-10, 10, 20)
        state.camera.position.lerp(target, 0.1)
        state.camera.lookAt(0, 0, 0)

        if (state.camera.position.distanceTo(target) < 0.01) {
            // stop overriding the camera
            setAnimating(false)
        }
    })

    return (
        <group>
            <HelloFragments visible={clicked} />
            <HelloModel
                visible={!clicked}
                onClick={() => {
                    setClicked(true)
                    setAnimating(true) // start lerp once clicked
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            />
        </group>
    )
}


export default function Scene() {
    const controlsRef = useRef()

    return (
        <>
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={260} />
            <OrbitControls
                ref={controlsRef}
                enableZoom={true}
                rotateSpeed={2.22}
                enablePan={true}
                enableRotate={true}
                mouseButtons={{
                    LEFT: THREE.MOUSE.PAN,
                    MIDDLE: THREE.MOUSE.ROTATE,
                    RIGHT: THREE.MOUSE.DOLLY,
                }}
            />

            <ambientLight />
            <Suspense fallback={null}>
                <HelloScene controlsRef={controlsRef} />
                <Preload all />
            </Suspense>
        </>
    )
}
