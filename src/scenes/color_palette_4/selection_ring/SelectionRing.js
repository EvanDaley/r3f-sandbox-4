// components/props/SelectionRing.js
import React, { useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

export default function SelectionRing({
                                          position = [0, 0, 0],
                                          visible = false,
                                          color = "#00ffff",
                                          pulseSpeed = 2.0,
                                      }) {
    const ref = useRef()
    const materialRef = useRef()

    useFrame((state, delta) => {
        if (!ref.current || !materialRef.current) return
        ref.current.rotation.z += delta * 0.5
        const t = state.clock.getElapsedTime() * pulseSpeed
        materialRef.current.opacity = 0.5 + Math.sin(t) * 0.25
    })

    return (
        <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]} visible={visible}>
            <ringGeometry args={[1.2, 1.4, 128]} />
            <meshStandardMaterial
                emissive={new THREE.Color(color)}
                emissiveIntensity={2}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}
