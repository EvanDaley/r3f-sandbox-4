// components/props/SelectionRing.js
import React, { useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

export default function SelectionRing({ position = [0, 0, 0], visible = false, color = "#00ffff" }) {
    const ref = useRef()

    // simple hover/rotation effect
    useFrame((_, delta) => {
        if (ref.current && visible) {
            ref.current.rotation.z += delta * 0.5
        }
    })

    return (
        <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]} visible={visible}>
            <ringGeometry args={[1.2, 1.4, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
    )
}
