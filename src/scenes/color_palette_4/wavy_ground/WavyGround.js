import { useRef, useEffect } from "react"
import * as THREE from "three"

export default function WavyGround({ color = "#445533", wireColor = "#222" }) {
    const meshRef = useRef()
    const wireRef = useRef()
    const geometry = new THREE.PlaneGeometry(40, 40, 100, 100)

    // Apply the displacement once
    useEffect(() => {
        const positions = geometry.attributes.position
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i)
            const y = positions.getY(i)
            const z = Math.sin(x * 0.3) * 0.3 + Math.cos(y * 0.3) * 0.3
            positions.setZ(i, z)
        }
        positions.needsUpdate = true

        meshRef.current.rotation.x = -Math.PI / 2
        wireRef.current.rotation.x = -Math.PI / 2
    }, [geometry])

    return (
        <>
            {/* Solid ground */}
            <mesh ref={meshRef} geometry={geometry}>
                <meshStandardMaterial color={color} roughness={1} />
            </mesh>

            {/* Wireframe overlay */}
            <mesh ref={wireRef} geometry={geometry}>
                <meshBasicMaterial color={wireColor} wireframe />
            </mesh>
        </>
    )
}
